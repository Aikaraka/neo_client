"use client";

import {
  FormEventHandler,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GraphemeSplitter from "grapheme-splitter";
import { Undo as UndoIcon } from "lucide-react";
import Image from "next/image";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

// Supabase AuthProvider 훅
import { useSupabase } from "@/utils/supabase/authProvider";

const NanumMyeongjo = localFont({
  src: "../../fonts/NanumMyeongjo.ttf",
  weight: "400",
  style: "normal",
});

// 타입 정의 (간단 예시)
type Message = string | { type: 'background'; content: string };

interface BufferState {
  queue: string[];
  current: string;
  display: string;
  isProcessing: boolean;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // novelId 가져오기
  const novelId = searchParams.get("novelId");

  // 실제 로그인된 유저 ID
  const [userId, setUserId] = useState<string | null>(null);

  // Supabase 인스턴스
  const supabase = useSupabase();

  // 메시지 목록
  const [messages, setMessages] = useState<Message[]>([]);
  // 진행률
  const [progressRate, setProgressRate] = useState(0);

  // 입력 중인 메시지
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMessageSending, setIsMessageSending] = useState(false);

  // Typing effect
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [bufferState, setBufferState] = useState<BufferState>({
    queue: [],
    current: "",
    display: "",
    isProcessing: false,
  });

  // 상단에 title state 추가
  const [novelTitle, setNovelTitle] = useState<string>("Chat with Novel");

  // (1) 로그인된 유저 정보
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error getting user from Supabase:", error);
        } else {
          setUserId(user?.id ?? null);
          
          // 유저 정보가 있으면 init-story 호출
          if (user?.id && novelId) {
            const { data: { session } } = await supabase.auth.getSession();
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            
            const res = await fetch(`${API_URL}/init-story`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.access_token}`,
                "Refresh-Token": session?.refresh_token
              },
              body: JSON.stringify({
                user_id: user.id,
                novel_id: novelId,
              }),
            });
            
            const data = await res.json();
            if (data.title) {
              setNovelTitle(data.title);  // init-story 응답의 title 사용
            }
          }
        }
      } catch (err) {
        console.error("유저 정보 조회 오류:", err);
      }
    };
    fetchUser();
  }, [supabase, novelId]);

  // (2) init-story가 끝난 뒤 -> messages에 배경 메시지 등 추가할 수도 있음
  //    여기서는 간단히 "채팅방 진입" 정도만
  useEffect(() => {
    if (!novelId) {
      alert("novelId가 필요합니다.");
      router.push("/");
    }
  }, [novelId, router]);

  // (3) process-input 호출
  const handleSendMessage = async (auto = false) => {
    if (!novelId || !userId) {
      alert("userId, novelId가 필요합니다.");
      return;
    }
    if (isMessageSending) return;

    const inputElem = textareaRef.current;
    if (!inputElem) return;

    let text = auto ? "계속 진행해주세요." : inputElem.value.trim();
    if (!text) return;

    setIsMessageSending(true);
    const messageIndex = messages.length;
    setMessages((prev) => [...prev, ""]); // 새 메시지 자리 확보

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch(`${API_URL}/process-input`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          novel_id: novelId,
          text,
        }),
      });

      if (!res.body) {
        throw new Error("ReadableStream not supported.");
      }

      const reader = res.body.getReader();
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

        let lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (let line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();

            if (dataStr === "[DONE]") {
              break;
            }
            try {
              const data = JSON.parse(dataStr);

              if (data.type === "story") {
                // 스토리 청크
                accumulatedText += data.content;
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  newMsgs[messageIndex] = accumulatedText;
                  return newMsgs;
                });
              } else if (data.type === "progress") {
                setProgressRate(data.progress_rate);
              } else if (data.type === "error") {
                console.error("오류 발생:", data.message);
                alert("오류 발생: " + data.message);
              }
            } catch (err) {
              console.error("JSON 파싱 오류:", err);
              console.error("line:", line);
            }
          }
        }
      }
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      alert("메시지 전송 중 오류가 발생했습니다.");
    } finally {
      setIsMessageSending(false);
    }
  };

  // (4) undo-last-action
  const handleUndo = async () => {
    if (!novelId || !userId) return;
    if (!confirm("이전 대화를 취소하시겠습니까?")) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/undo-last-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          novel_id: novelId,
        }),
      });
      const data = await res.json();

      if (data.success) {
        // 마지막 메시지를 삭제
        setMessages((prev) => prev.slice(0, -1));
        if (data.progress_rate !== undefined) {
          setProgressRate(data.progress_rate);
        }
        alert("이전 행동이 취소되었습니다.");
      } else {
        alert("더 이상 취소할 수 없습니다.");
      }
    } catch (err) {
      console.error("undo error:", err);
      alert("되돌리기 중 오류가 발생했습니다.");
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
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-black"
        >
          뒤로
        </button>

        <div className="flex-1 mx-3">
          {/* 예: 소설 제목, 진행률 등 표시 */}
          <div className="flex flex-col items-center">
            <span className="font-medium text-sm">{novelTitle}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">진행률</span>
              <div className="flex-1 flex items-center w-48">
                {/* 간단히 프로그레스바 대용 */}
                <div className="h-2 w-full bg-gray-200 relative rounded">
                  <div
                    className="h-2 bg-purple-400 rounded"
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

        <button onClick={handleUndo} className="text-gray-600 hover:text-black">
          <UndoIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-auto px-4 py-2 space-y-4">
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
      <div className="p-4 border-t flex items-center gap-2">
        <textarea
          ref={textareaRef}
          onChange={handleTextAreaChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="메시지를 입력하세요."
          className="w-full border border-gray-300 rounded p-2 text-sm resize-none leading-relaxed"
          disabled={isMessageSending}
        ></textarea>

        <button
          onClick={() => handleSendMessage(false)}
          disabled={isMessageSending}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          전송
        </button>

        <button
          onClick={() => handleSendMessage(true)}
          disabled={isMessageSending}
          className="bg-gray-300 text-black px-3 py-2 rounded"
        >
          계속
        </button>
      </div>
    </div>
  );
}
