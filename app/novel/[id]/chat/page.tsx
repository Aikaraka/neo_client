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
import { useSuspenseQuery } from "@tanstack/react-query";
import { initStory } from "@/app/novel/[id]/chat/_api/initStory.api";
import { AutoChat, PaperPlane } from "@/public/novel/chat";
import PrevPageButton from "@/components/ui/PrevPageButton";
import { processNovel } from "@/app/novel/[id]/chat/_api/process.api";
import { undoLastStory } from "@/app/novel/[id]/chat/_api/undo.api";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { getNovel } from "@/app/novel/_api/novel.client";

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

export default function ChatPage() {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { id: novelId } = useParams<{ id: string }>();

  const { data: novel } = useSuspenseQuery({
    queryKey: ["initStory", novelId],
    queryFn: async () => {
      const novel = await getNovel(novelId);
      await initStory(novelId);
      return novel;
    },
  });
  const session = useSession();
  const { toast } = useToast();

  // Supabase 인스턴스
  const supabase = useSupabase();

  // 메시지 목록
  const [messages, setMessages] = useState<Message[]>([]);
  // 진행률
  const [progressRate, setProgressRate] = useState(0);

  // 입력 중인 메시지
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMessageSending, setIsMessageSending] = useState(false);

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

      if (!stream.body) {
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
              <span className="font-medium text-sm">{novel.title}</span>
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
          <div
            className={`bg-primary p-4 text-white rounded-xl ${NanumMyeongjo.className}`}
          >
            {novel.background?.start ?? "여러분들의 소설을 시작해보세요."}
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

            <AutoChat
              onClick={() => handleSendMessage(true)}
              aria-disabled={isMessageSending}
              className={`text-primary  ${
                isMessageSending ? "opacity-50" : "cursor-pointer"
              }`}
            />
            <PaperPlane
              onClick={() => handleSendMessage(false)}
              aria-disabled={isMessageSending}
              className={`text-primary  ${
                isMessageSending ? "opacity-50" : "cursor-pointer"
              }`}
            />
          </div>
        </div>
      </div>
    </Toaster>
  );
}
