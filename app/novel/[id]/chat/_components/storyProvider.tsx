"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  initStory,
  InitStoryResponse,
} from "@/app/novel/[id]/chat/_api/initStory.api";
import * as Sentry from "@sentry/nextjs";
import { getPreviousStories } from "@/app/novel/[id]/chat/_api/prevStory.api";
import { processNovel } from "@/app/novel/[id]/chat/_api/process.api";
import { undoLastStory } from "@/app/novel/[id]/chat/_api/undo.api";
import { generateImage } from "@/app/novel/[id]/chat/_api/generateImage.api";
import { LoadingModal } from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/utils/supabase/authProvider";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export type Message = {
  type: "user" | "ai"
  content: string
  story_number?: number
  user_input?: string
  image_url?: string
}

type StoryContextType = Omit<InitStoryResponse, "progress_rate"> & {
  messages: Message[];
  isMessageError: boolean;
  progressRate: number;
  undoStory: () => void;
  sendNovelProcessMessage: (auto: boolean, input?: string) => void;
  isMessageSending: boolean;
  initError: boolean;
  fetchMoreStories: () => Promise<void>;
  currPage: number;
  initPending: boolean;
  hasMoreStories: boolean;
  scrollType: ScrollBehavior | "none";
  prevFetching: boolean;
  archivedImages: string[];
  isGeneratingImage: boolean;
  streamingBackgroundStart: string;
  isBackgroundStreaming: boolean;
  showProtagonistMessage: boolean;
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function useStoryContext() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("StoryContext를 찾을 수 없습니다.");
  }
  return context;
}

const TOAST_GEN_NOVEL_ERROR_TITLE = "세계관 생성 오류";
const TOAST_GEN_NOVEL_ERROR_DESCRIPTION = "세계관 생성중 오류가 발생했습니다.";
const TOAST_UNDO_NOVEL_SUCCESS_TITLE = "소설 되돌리기";
const TOAST_UNDO_NOVEL_SUCCESS_DESCRIPTION = "소설을 되돌렸습니다.";
const TOAST_UNDO_NOVEL_ERROR_TITLE = "소설 되돌리기 오류";
const TOAST_UDNO_NOVEL_ERROR_DECRIPTION = "더 되돌릴 소설이 없습니다.";

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const { id: novelId } = useParams<{ id: string }>();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [progressRate, setProgressRate] = useState(0);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [currPage, setCurrPage] = useState(0);
  const [hasMoreStories, setHasMoreStories] = useState(false);
  const [scrollType, setScrollType] = useState<ScrollBehavior | "none">(
    "instant"
  );
  const [prevFetching, setPrevFetching] = useState(false);
  const [archivedImages, setArchivedImages] = useState<string[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedProgressMilestones, setGeneratedProgressMilestones] = useState<Set<number>>(new Set());
  const [streamingBackgroundStart, setStreamingBackgroundStart] = useState("");
  const [isBackgroundStreaming, setIsBackgroundStreaming] = useState(false);
  const [showProtagonistMessage, setShowProtagonistMessage] = useState(false);
  const [hasStreamedBackground, setHasStreamedBackground] = useState(false);

  const {
    data: initialData,
    isPending: initPending,
    isError,
    error: initError,
  } = useQuery({
    queryKey: ["initStory", novelId],
    queryFn: async () => {
      try {
        const initSetting = await initStory(novelId);
        const restoredMessages: Message[] = [];
        for (const s of initSetting.initial_stories.slice().reverse()) {
          if (typeof s.user_input !== "undefined")
            restoredMessages.push({
              type: "user",
              content: s.user_input,
              story_number: s.story_number,
              user_input: s.user_input,
            })
          if (s.content)
            restoredMessages.push({
              type: "ai",
              content: s.content,
              story_number: s.story_number,
              user_input: s.user_input,
              image_url: s.image_url, // Add image_url from initial stories
            })
        }
        setMessages(restoredMessages)
        setScrollType("smooth");
        setProgressRate(initSetting.progress_rate);
        setCurrPage(initSetting.oldest_story_number);
        setHasMoreStories(initSetting.has_more_stories);
        
        return initSetting;
      } catch (error) {
        console.error(`[StoryProvider] initStory 실패:`, error);
        
        // Sentry에 에러 보고 (컨텍스트 포함)
        Sentry.captureException(error, {
          tags: { 
            component: "StoryProvider",
            action: "initStory",
          },
          extra: { 
            novelId,
            errorType: error instanceof Error ? error.constructor.name : typeof error,
            errorMessage: error instanceof Error ? error.message : String(error),
          },
        });
        
        // 세션 관련 에러인 경우 더 명확한 에러 메시지 제공
        if (error instanceof Error && error.message.includes("세션")) {
          toast({
            title: "로그인이 필요합니다",
            description: "세계관에 진입하려면 로그인이 필요합니다.",
            variant: "destructive",
          });
        } else if (error instanceof TypeError && error.message.includes("fetch")) {
          toast({
            title: "서버 연결 실패",
            description: "백엔드 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
            variant: "destructive",
          });
        }
        throw error;
      }
    },
  });

  const session = useSession();
  const { toast } = useToast();

  // background.start를 스트리밍으로 표시하는 함수
  const streamBackgroundText = async (text: string) => {
    let accumulatedText = "";
    
    for (const char of text) {
      accumulatedText += char;
      setStreamingBackgroundStart(accumulatedText);
      // 각 문자마다 지연 (타이핑 효과)
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  };

  // 초기 데이터 로드 후 background 스트리밍 시작
  useEffect(() => {
    const startBackgroundStreaming = async () => {
      if (initialData && !initPending && !hasStreamedBackground) {
        setHasStreamedBackground(true);
        
        const backgroundText = initialData.background?.start ?? "여러분들의 소설을 시작해보세요.";
        setIsBackgroundStreaming(true);
        await streamBackgroundText(backgroundText);
        setIsBackgroundStreaming(false);
        
        // 스트리밍 완료 후 protagonist 메시지 표시
        setShowProtagonistMessage(true);
      }
    };
    
    startBackgroundStreaming();
  }, [initialData, initPending, hasStreamedBackground]);

  const sendNovelProcessMessage = async (auto = false, input = "") => {
    if (isMessageSending) return;
    
    // 세션 검증 추가
    if (!session?.user?.id) {
      toast({
        title: "인증 오류",
        description: "세션이 만료되었습니다. 다시 로그인해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    const aiMessageCount = messages.filter((msg) => msg.type === "ai").length
    const shouldGenerateImage = (aiMessageCount + 1) % 1 === 0

    setScrollType("smooth");
    try {
      setIsMessageSending(true);

      const text = auto ? "계속 진행해주세요." : input;
      if (!text) return;

      // 현재 메시지가 있는지 확인하고 story_number를 안전하게 가져오기
      const lastMessage = messages[messages.length - 1];
      const currentStoryNumber = lastMessage?.story_number ?? 0;

      // 자동 생성이든 수동 입력이든 사용자 입력 메시지는 항상 'user' 타입으로 추가
      setMessages((prev) => [
        ...prev,
        { type: 'user' as const, content: text, story_number: currentStoryNumber, user_input: text },
        { type: 'ai' as const, content: "", story_number: currentStoryNumber, user_input: text },
      ]);

      const stream = await processNovel(session, novelId, text, shouldGenerateImage);

      if (!stream?.body) {
        console.error(`[StoryProvider] ReadableStream 없음:`, stream);
        throw new Error("ReadableStream not supported.");
      }

      const reader = stream.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";
      let accumulatedText = "";
      let imageUrl = "";

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
              // <E> 토큰 필터링 (완전한 토큰과 불완전한 토큰 모두 제거)
              const originalContent = data.content;
              const filteredContent = originalContent
                .replace(/<E[^>]*>/g, '')  // 완전한 <E> 토큰 제거
                .replace(/<E[^>]*$/g, '')  // <E로 시작하는 불완전한 토큰 제거
                .replace(/<E$/g, '');      // <E로 끝나는 경우 제거
              
              // 문자 단위로 실시간 타이핑 효과 구현
              for (const char of filteredContent) {
                accumulatedText += char;
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  const lastAiIdx = newMsgs.map(m => m.type).lastIndexOf('ai');
                  if (lastAiIdx !== -1) {
                    newMsgs[lastAiIdx] = { type: 'ai', content: accumulatedText, story_number: data.story_number, user_input: data.user_input, image_url: imageUrl };
                  }
                  return newMsgs;
                });
                // 각 문자마다 지연 (타이핑 효과)
                await new Promise(resolve => setTimeout(resolve, 30));
              }
              

            } else if (data.type === "image") {
              imageUrl = data.image_url;
              // 즉시 상태를 업데이트하여 이미지 렌더링
              setMessages((prev) => {
                const newMsgs = [...prev];
                const lastAiIdx = newMsgs.map(m => m.type).lastIndexOf('ai');
                if (lastAiIdx !== -1) {
                  // 기존 content는 유지하면서 image_url만 추가/업데이트
                  newMsgs[lastAiIdx] = { ...newMsgs[lastAiIdx], image_url: imageUrl };
                }
                return newMsgs;
              });
            } else if (data.type === "progress") {
              setProgressRate(data.progress_rate);
              
              // 진행률 마일스톤 체크 및 이미지 생성
              const currentProgress = data.progress_rate;
              const milestones = [20, 40, 60, 80, 100];
              
              for (const milestone of milestones) {
                if (currentProgress >= milestone && !generatedProgressMilestones.has(milestone)) {
                  // 마일스톤 기록
                  setGeneratedProgressMilestones(prev => new Set([...prev, milestone]));
                  
                  // 이미지 생성 (비동기로 실행하여 스토리 진행을 방해하지 않음)
                  generateImageForProgress(milestone);
                  break; // 한 번에 하나의 마일스톤만 처리
                }
              }
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
    } catch (error) {
      console.error(`[StoryProvider] processNovel 오류:`, error);
      
      if (error instanceof Error && error.message.includes('TOKEN_INSUFFICIENT')) {
        toast({
          variant: "destructive",
          title: "조각이 다 떨어졌어요!",
          description: "더 많은 소설을 보려면 조각을 충전해주세요.",
          action: (
            <button
              onClick={() => router.push('/store')}
              className="bg-white text-red-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              조각 충전하기
            </button>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: TOAST_GEN_NOVEL_ERROR_TITLE,
          description: TOAST_GEN_NOVEL_ERROR_DESCRIPTION,
        });
      }
    } finally {
      setIsMessageSending(false);
    }
  };

  const generateImageForProgress = async (milestone: number) => {
    if (!session) {
      return;
    }

    try {
      setIsGeneratingImage(true);
      
      const result = await generateImage(session, novelId);
      
      if (result.success && result.image_url) {
        
        // 보관함에 이미지 추가
        setArchivedImages(prev => [...prev, result.image_url]);
        
        toast({
          title: "이미지 생성 완료",
          description: (
            <div>
              진행률 {milestone}% 도달!
              <br />
              새로운 이미지가 보관함에 추가되었습니다.
            </div>
          ),
        });
      } else {
        console.error(`[StoryProvider] 진행률 ${milestone}% 이미지 생성 실패:`, result);
        
        toast({
          variant: "destructive",
          title: "이미지 생성 실패",
          description: "이미지 생성 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      console.error(`[StoryProvider] 진행률 ${milestone}% 이미지 생성 오류:`, error);
      
      toast({
        variant: "destructive", 
        title: "이미지 생성 오류",
        description: "이미지 생성 중 오류가 발생했습니다.",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const undoStory = async () => {
    if (!confirm("이전 대화를 취소하시겠습니까?")) return;

    try {
      const res = await undoLastStory(novelId, session?.user.id);
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.slice(0, -2)); // 유저 메시지 포함해서 2개 삭제
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

  const fetchMoreStories = async () => {
    if (initPending || !hasMoreStories || prevFetching) return;
    setScrollType("none");
    try {
      setPrevFetching(true);
      const { has_more, stories } = await getPreviousStories(
        novelId,
        currPage
      );
      const sortedStories = stories.sort(
        (a, b) => a.story_number - b.story_number
      );
      const prevMessages: Message[] = [];
      for (const s of sortedStories) {
        if (typeof s.user_input !== "undefined")
          prevMessages.push({
            type: "user",
            content: s.user_input,
            story_number: s.story_number,
            user_input: s.user_input,
          })
        if (s.content)
          prevMessages.push({
            type: "ai",
            content: s.content,
            story_number: s.story_number,
            user_input: s.user_input,
            image_url: s.image_url, // Add image_url from previous stories
          })
      }
      setMessages((prev) => [...prevMessages, ...prev]);
      setHasMoreStories(has_more);
      setCurrPage(sortedStories[0]?.story_number ?? 0);
    } catch {
      toast({
        title: "이전 스토리 불러오기 오류",
        description: "이전 스토리를 불러오는 중 오류가 발생했습니다.",
      });
    } finally {
      setPrevFetching(false);
    }
  };

  return (
    <StoryContext.Provider
      value={{
        messages,
        progressRate,
        sendNovelProcessMessage,
        undoStory,
        isMessageSending,
        title: initialData?.title ?? "",
        story: initialData?.story,
        background: initialData?.background ?? {
          start: "여러분들의 소설을 시작해보세요",
          detailedLocations: [],
        },
        has_more_stories: initialData?.has_more_stories ?? false,
        initial_stories: initialData?.initial_stories ?? [],
        oldest_story_number: initialData?.oldest_story_number ?? 0,
        isMessageError: isError,
        initError: !!initError,
        fetchMoreStories,
        currPage,
        hasMoreStories,
        scrollType,
        initPending,
        prevFetching,
        archivedImages,
        isGeneratingImage,
        streamingBackgroundStart,
        isBackgroundStreaming,
        protagonist_name: initialData?.protagonist_name,
        showProtagonistMessage,
      }}
    >
      {children}
      <LoadingModal visible={initPending} />
    </StoryContext.Provider>
  );
}
