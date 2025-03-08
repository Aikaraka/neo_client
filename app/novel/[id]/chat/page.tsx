"use client";

import {
  FormEventHandler,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { Undo as UndoIcon } from "lucide-react";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

// Supabase AuthProvider 훅
import { useSession, useSupabase } from "@/utils/supabase/authProvider";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { initStory } from "@/app/novel/[id]/chat/_api/initStory.api";
import { AutoChat, PaperPlane } from "@/public/novel/chat";
import PrevPageButton from "@/components/ui/PrevPageButton";
import { processNovel } from "@/app/novel/[id]/chat/_api/process.api";
import { undoLastStory } from "@/app/novel/[id]/chat/_api/undo.api";
import { fetchPreviousStories } from "@/app/novel/[id]/chat/_api/fetchPreviousStories.api";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { getNovel } from "@/app/novel/_api/novel.client";
import { Button } from "@/components/ui/button";
import { LoadingModal } from "@/components/ui/modal";

const NanumMyeongjo = localFont({
  src: "../../../fonts/NanumMyeongjo.ttf",
  weight: "400",
  style: "normal",
});

const TOAST_GEN_NOVEL_ERROR_TITLE = "소설 생성 오류";
const TOAST_GEN_NOVEL_ERROR_DESCRIPTION = "소설 생성중 오류가 발생했습니다.";
const TOAST_UNDO_NOVEL_SUCCESS_TITLE = "소설 되돌리기";
const TOAST_UNDO_NOVEL_SUCCESS_DESCRIPTION = "소설을 되돌렸습니다.";
const TOAST_UNDO_NOVEL_ERROR_TITLE = "소설 되돌리기 오류";
const TOAST_UDNO_NOVEL_ERROR_DECRIPTION = "더 되돌릴 소설이 없습니다.";
// 타입 정의 (간단 예시)
type Message = string | { type: "background"; content: string };

interface StoryItem {
  content: string;
  story_number: number;
}

interface InitStoryResponse {
  title: string;
  story?: string;
  initial_stories: StoryItem[];
  has_more_stories: boolean;
  oldest_story_number: number;
  background: any;
  progress_rate: number;
}

export default function ChatPage() {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { id: novelId } = useParams<{ id: string }>();
  const [progressRate, setProgressRate] = useState<number>(0);

  const { data: novel, isPending } = useQuery({
    queryKey: ["initStory", novelId],
    queryFn: async () => {
      const novel = await getNovel(novelId);
      const initData = await initStory(novelId);
      
      console.log("Init data:", initData);  // 디버깅용 로그

      if (initData.initial_stories) {
        setMessages(initData.initial_stories.map((story: StoryItem) => story.content));
        setOldestStoryNumber(initData.oldest_story_number);
        setHasMoreStories(initData.has_more_stories);
        
        // 진행률 설정
        if (initData.progress_rate !== undefined) {
          setProgressRate(initData.progress_rate);
        }
        
        // 초기 데이터 로드 후 스크롤을 최하단으로 이동
        setTimeout(() => {
          if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
          }
        }, 100);
      }
            
      return novel;
    },
  });
  const session = useSession();
  const { toast } = useToast();

  // Supabase 인스턴스
  const supabase = useSupabase();

  // 메시지 목록
  const [messages, setMessages] = useState<Message[]>([]);

  // 입력 중인 메시지
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMessageSending, setIsMessageSending] = useState(false);

  // 무한 스크롤을 위한 상태 추가
  const [oldestStoryNumber, setOldestStoryNumber] = useState<number | null>(null);
  const [hasMoreStories, setHasMoreStories] = useState(true);
  const [isLoadingPreviousStories, setIsLoadingPreviousStories] = useState(false);
  const MAX_VISIBLE_MESSAGES = 50; // 메모리에 유지할 최대 메시지 수

  // (2) init-story가 끝난 뒤 -> messages에 배경 메시지 등 추가할 수도 있음
  //    여기서는 간단히 "채팅방 진입" 정도만
  useEffect(() => {
    if (!novelId) {
      alert("novelId가 필요합니다.");
      router.push("/");
    }
  }, [novelId, router]);

  useEffect(() => {
    messageBoxRef?.current?.scrollTo({
      top: messageBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // (3) process-input 호출
  const handleSendMessage = async (auto = false) => {
    if (isMessageSending) return;
    try {
      setIsMessageSending(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) throw new Error("회원 정보를 찾지 못했습니다.");

      const inputElem = textareaRef.current;
      if (!inputElem) return;

      const text = auto ? "계속 진행해주세요." : inputElem.value.trim();
      if (!text) return;

      setMessages((prev) => [...prev, ""]);

      const stream = await processNovel(session, novelId, text);

      if (!stream?.body) {
        throw new Error("ReadableStream not supported.");
      }

      const reader = stream.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";
      let accumulatedText = "";

      // textarea 비우기
      if (!auto) inputElem.value = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunkValue = decoder.decode(value || new Uint8Array(), {
          stream: !done,
        });
        buffer += chunkValue;

        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();
            if (dataStr === "[DONE]") {
              break;
            }

            const data = JSON.parse(dataStr);

            if (data.type === "story") {
              // 스토리 청크
              accumulatedText += data.content;
              setMessages((prev) => {
                const newMsgs = [...prev];
                newMsgs[messages.length] = accumulatedText;
                return newMsgs;
              });
            } else if (data.type === "progress") {
              setProgressRate(data.progress_rate);
            } else if (data.type === "error") {
              toast({
                variant: "destructive",
                title: TOAST_GEN_NOVEL_ERROR_TITLE,
                description: TOAST_GEN_NOVEL_ERROR_DESCRIPTION,
              });
            }
          }
        }
      }
    } catch {
      toast({
        variant: "destructive",
        title: TOAST_GEN_NOVEL_ERROR_TITLE,
        description: TOAST_GEN_NOVEL_ERROR_DESCRIPTION,
      });
    } finally {
      setIsMessageSending(false);
    }
  };

  // (4) undo-last-action
  const handleUndo = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) throw new Error("회원 정보를 찾지 못했습니다.");
    if (!confirm("이전 대화를 취소하시겠습니까?")) return;

    try {
      const res = await undoLastStory(novelId, session?.user.id);
      const data = await res.json();
      if (data.success) {
        // 마지막 메시지를 삭제
        setMessages((prev) => prev.slice(0, -1));
        if (data.progress_rate) {
          setProgressRate(data.progress_rate);
        }
        toast({
          title: TOAST_UNDO_NOVEL_SUCCESS_TITLE,
          description: TOAST_UNDO_NOVEL_SUCCESS_DESCRIPTION,
        });
      } else {
        toast({
          title: TOAST_UNDO_NOVEL_ERROR_TITLE,
          description: TOAST_UDNO_NOVEL_ERROR_DECRIPTION,
        });
      }
    } catch {
      toast({
        title: TOAST_UNDO_NOVEL_ERROR_TITLE,
        description: TOAST_UDNO_NOVEL_ERROR_DECRIPTION,
      });
    }
  };

  // 이전 스토리 로드 함수
  const loadPreviousStories = async () => {
    if (isLoadingPreviousStories || !hasMoreStories || oldestStoryNumber === null) return;
    
    try {
      setIsLoadingPreviousStories(true);
      
      // 스크롤 위치 기억
      const messageBox = messageBoxRef.current;
      if (!messageBox) return;
      
      const prevScrollHeight = messageBox.scrollHeight;
      const prevScrollTop = messageBox.scrollTop;
      
      console.log("Loading previous stories before:", oldestStoryNumber);
      
      // 이전 스토리 가져오기
      const result = await fetchPreviousStories(
        session, 
        novelId as string, 
        oldestStoryNumber, 
        3
      );
      
      console.log("Previous stories result:", result);
      
      if (result.stories.length === 0) {
        setHasMoreStories(false);
      } else {
        // 새 스토리를 메시지 배열 앞에 추가
        const newMessages = result.stories.map(story => story.content);
        
        setMessages(prev => {
          // 새 메시지와 기존 메시지 합치기
          const combinedMessages = [...newMessages, ...prev];
          
          // 메시지가 너무 많아지면 최신 메시지 일부 제거
          if (combinedMessages.length > MAX_VISIBLE_MESSAGES) {
            return combinedMessages.slice(0, MAX_VISIBLE_MESSAGES);
          }
          return combinedMessages;
        });
        
        // 가장 오래된 스토리 번호 업데이트
        if (result.stories.length > 0) {
          const newOldestStory = result.stories.reduce(
            (oldest, current) => current.story_number < oldest.story_number ? current : oldest,
            result.stories[0]
          );
          setOldestStoryNumber(newOldestStory.story_number);
        }
        
        // 더 이전 스토리 존재 여부 설정
        setHasMoreStories(result.has_more);
        
        // 스크롤 위치 유지 - 개선된 방식
        // DOM 업데이트가 완료된 후 스크롤 위치를 조정하기 위해 약간의 지연 추가
        setTimeout(() => {
          if (messageBox) {
            const newScrollHeight = messageBox.scrollHeight;
            const heightDifference = newScrollHeight - prevScrollHeight;
            
            // 새로 추가된 콘텐츠의 높이만큼 스크롤 위치 조정
            messageBox.scrollTop = prevScrollTop + heightDifference;
            
            console.log("Scroll adjusted:", {
              prevScrollHeight,
              newScrollHeight,
              heightDifference,
              prevScrollTop,
              newScrollTop: prevScrollTop + heightDifference
            });
          }
        }, 50); // 약간의 지연 추가
      }
    } catch (error) {
      console.error("Failed to load previous stories:", error);
      toast({
        variant: "destructive",
        title: "이전 스토리 로드 오류",
        description: "이전 스토리를 불러오는데 실패했습니다."
      });
      setHasMoreStories(false);
    } finally {
      setIsLoadingPreviousStories(false);
    }
  };

  // 스크롤 감지 useEffect 추가
  useEffect(() => {
    const messageBox = messageBoxRef.current;
    if (!messageBox) return;
    
    // 이전 스크롤 위치를 저장할 변수
    let lastScrollTop = messageBox.scrollTop;
    
    const handleScroll = () => {
      // 스크롤 방향 확인 (위로 스크롤하는 경우에만 이전 스토리 로드)
      const scrollTop = messageBox.scrollTop;
      const scrollingUp = scrollTop < lastScrollTop;
      
      // 현재 스크롤 위치 저장
      lastScrollTop = scrollTop;
      
      // 위로 스크롤 중이고, 스크롤이 상단에 가까울 때만 이전 스토리 로드
      if (scrollingUp && scrollTop < 100 && !isLoadingPreviousStories && hasMoreStories) {
        loadPreviousStories();
      }
    };
    
    messageBox.addEventListener('scroll', handleScroll);
    return () => messageBox.removeEventListener('scroll', handleScroll);
  }, [isLoadingPreviousStories, hasMoreStories, oldestStoryNumber]);

  // textarea 자동 높이 조절
  const handleTextAreaChange: FormEventHandler<HTMLTextAreaElement> = (e) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(false);
    }
  };
  return (
    <Toaster>
      <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between">
          <PrevPageButton />

          <div className="flex-1 mx-3">
            {/* 예: 소설 제목, 진행률 등 표시 */}
            <div className="flex flex-col items-center">
              <span className="font-medium text-sm">{novel?.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">진행률</span>
                <div className="flex-1 flex items-center w-48">
                  {/* 간단히 프로그레스바 대용 */}
                  <div className="h-2 w-full bg-gray-200 relative rounded">
                    <div
                      className="h-2 bg-purple-400 rounded transition-all duration-700 ease-in-out"
                      style={{ width: `${progressRate}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {progressRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleUndo}
            className="text-gray-600 hover:text-black"
          >
            <UndoIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Content */}
        <div
          ref={messageBoxRef}
          className="flex-1 overflow-auto px-4 py-2 space-y-4"
        >

          {/* 로딩 인디케이터 */}
          {isLoadingPreviousStories && (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          )}
          
          <div
            className={`bg-primary p-4 text-white rounded-xl ${NanumMyeongjo.className}`}
          >
            {novel?.background && typeof novel.background === 'object' && 'start' in novel.background 
              ? String(novel.background.start)
              : "여러분들의 소설을 시작해보세요."}
          </div>
          {messages.map((msg, i) => {
            if (typeof msg === "string") {
              // 일반 스토리 메시지
              return (
                <p
                  key={i}
                  className={cn(
                    "text-[15px] leading-[1.6] text-gray-800 whitespace-pre-line",
                    NanumMyeongjo.className
                  )}
                >
                  {msg}
                </p>
              );
            } else {
              // 배경 메시지 등
              return (
                <div
                  key={i}
                  className="p-4 bg-purple-100 border border-purple-200 rounded"
                >
                  {msg.content}
                </div>
              );
            }
          })}
        </div>

        {/* Input */}
        <div className="p-4 items-center gap-2">
          <div className="flex items-center gap-2 bg-input rounded-xl px-3">
            <textarea
              ref={textareaRef}
              onChange={handleTextAreaChange}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="메시지를 입력하세요."
              className="flex-1 bg-input rounded-xl p-2 text-sm resize-none leading-relaxed overflow-auto max-h-10 focus:outline-none focus:ring-0 focus:border-transparent"
              disabled={isMessageSending}
            ></textarea>
            <div className="flex gap-2">
              <Button
                variant={"link"}
                className={`text-primary  ${
                  isMessageSending ? "opacity-50" : "cursor-pointer"
                } p-0 flex items-center justify-center [&_svg]:size-5`}
                disabled={isMessageSending}
                onClick={() => handleSendMessage(true)}
              >
                <AutoChat viewBox="0 0 24 24" />
              </Button>
              <Button
                variant={"link"}
                onClick={() => handleSendMessage(false)}
                aria-disabled={isMessageSending}
                className={`text-primary  ${
                  isMessageSending ? "opacity-50" : "cursor-pointer"
                } p-0 flex items-center [&_svg]:size-5`}
              >
                <PaperPlane />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <LoadingModal visible={isPending} />
    </Toaster>
  );
}
