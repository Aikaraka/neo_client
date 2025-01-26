"use client"; // Add this line at the very top

import {
  FormEventHandler,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  AutoChat,
  DotsHorizontal,
  PaperPlane,
} from "@/public/novel/chat";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import GraphemeSplitter from "grapheme-splitter";
import { Undo as UndoIcon } from "lucide-react";

const NanumMyeongjo = localFont({
  src: "../../fonts/NanumMyeongjo.ttf",
  weight: "400",
  style: "normal",
});

const TITLE = "유지민, 첫 사랑 그녀";
const TEXTAREA_MAX_HEIGHT = 100;
const API_URL = "http://15.152.208.196:8000";

const BACKGROUND_MESSAGE_CLASS = `
  p-6 rounded-lg 
  bg-gradient-to-br from-[#6B5BE6] to-[#8677F0] 
  shadow-sm 
  ring-1 ring-white/50 ring-inset
  text-white 
  mb-6
  relative
  before:content-[''] 
  before:absolute 
  before:inset-[3px] 
  before:rounded-md 
  before:border 
  before:border-white/20
`;

type Message = string | { type: 'background'; content: string };

interface BufferState {
  queue: string[];
  current: string;
  display: string;
  isProcessing: boolean;
}

export default function Component() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [progressRate, setProgressRate] = useState<number>(0);
  const { toast } = useToast();
  const router = useRouter();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [bufferState, setBufferState] = useState<BufferState>({
    queue: [],
    current: "",
    display: "",
    isProcessing: false
  });

  const [displayText, setDisplayText] = useState("");
  const [fullText, setFullText] = useState("");
  const typingSpeed = 250; // 타이핑 속도 (ms)

  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const initializeStory = async () => {
      try {
        const res = await fetch(`${API_URL}/init-story`, {
          method: "POST",
        });
        const data = await res.text();
        const cleanedData = data
          .replace(/[\[\]"]/g, '')
          .replace(/\\n/g, ' ')
          .replace(/\n/g, ' ')
          .trim();
        setMessages([{ type: 'background', content: cleanedData }]);
        setProgressRate(0);
        setIsInitialized(true);
      } catch (error) {
        console.error(error);
        toast({
          title: "오류가 발생했습니다.",
          description: "초기화 과정에서 오류가 발생했습니다.",
        });
      }
    };
    initializeStory();
  }, [toast]);

  useEffect(() => {
    let currentIndex = displayText.length;
    
    if (currentIndex < fullText.length) {
        const timer = setTimeout(() => {
            setDisplayText(fullText.substring(0, currentIndex + 1));
        }, typingSpeed);
        
        return () => clearTimeout(timer);
    }
  }, [displayText, fullText]);

  // 메시지 전송
  const handleSendMessage = async ({ auto }: { auto?: boolean } = {}) => {
    const current = textareaRef.current;
    if (!current) return;

    setIsMessageSending(true);
    const messageIndex = messages.length;
    setMessages((prev) => [...prev, ""]); // 새 메시지 자리 확보

    try {
      const response = await fetch(`${API_URL}/process-input`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: auto ? "계속 진행해주세요." : current.value,
          persona_name: "아린",
        }),
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      let accumulatedText = "";
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunkValue = decoder.decode(value, { stream: true });
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
                accumulatedText += data.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[messageIndex] = accumulatedText;
                  return newMessages;
                });
                if (data.progress_rate !== undefined) {
                  setProgressRate(data.progress_rate);
                }
              } else if (data.type === "error") {
                console.error("오류 발생:", data.message);
                toast({
                  title: "오류가 발생했습니다.",
                  description: data.message,
                  variant: "destructive",
                });
              } else if (data.type === "progress") {
                setProgressRate(data.progress_rate);
              }
            } catch (error) {
              console.error("JSON 파싱 오류:", error);
              console.error("받은 데이터:", dataStr);
            }
          }
        }
      }

      current.value = "";
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      toast({
        title: "오류가 발생했습니다.",
        description: "메시지 전송 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsMessageSending(false);
    }
  };

  // 타이핑 효과로 텍스트 표시
  const displayTextWithTypingEffect = (text: string, index: number) => {
    const splitter = new GraphemeSplitter();
    const characters = splitter.splitGraphemes(text);

    // 초기화
    setBufferState((prev) => ({
      ...prev,
      queue: characters,
      current: "",
      display: "",
      isProcessing: true,
    }));

    // [추가/변경 부분] messages[index]를 ""로 초기화
    setMessages((prev) => {
      const newMsgs = [...prev];
      newMsgs[index] = ""; // 아직 아무것도 없는 상태로 둠
      return newMsgs;
    });

    const chunkSize = 3; // 한번에 표시할 글자 수
    let i = 0;
    let currentText = "";

    const processNextChunk = () => {
      setBufferState((prev) => {
        // 더 이상 글자가 없으면 처리 완료
        if (prev.queue.length === 0) {
          return { ...prev, isProcessing: false };
        }

        // queue에서 chunkSize만큼 꺼내기
        const nextChunk = prev.queue.slice(0, chunkSize).join("");
        const newQueue = prev.queue.slice(chunkSize);

        currentText = prev.current + nextChunk; // 누적

        // [추가/변경 부분] messages도 동시에 업데이트
        setMessages((oldMsgs) => {
          const msgsCopy = [...oldMsgs];
          // 현재까지 누적된 텍스트를 messages[index]에 반영
          msgsCopy[index] = currentText;
          return msgsCopy;
        });

        return {
          queue: newQueue,
          current: currentText,
          display: currentText,
          isProcessing: true,
        };
      });

      // [추가/변경 부분] 이 chunk까지 끝나면 i 증가
      i += chunkSize;

      // 남은 글자가 있다면 타이머로 다음 chunk 진행
      if (i < characters.length) {
        typingTimeoutRef.current = setTimeout(processNextChunk, 50);
      }
    };

    // 이전 타이머가 있다면 제거
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // 첫 타이핑 시작
    processNextChunk();
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // textarea 높이 자동 조절
  const handleTextAreaValueChange: FormEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    const current = event.target as HTMLTextAreaElement;
    current.style.height = "auto";
    current.style.height =
      Math.min(current.scrollHeight, TEXTAREA_MAX_HEIGHT) + "px";
  };

  // 엔터 입력 시 메시지 전송
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Undo 기능
  const handleUndo = async () => {
    try {
      if (!confirm("이전 대화를 취소하시겠습니까?")) {
        return;
      }
      const response = await fetch(`${API_URL}/undo-last-action`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        setMessages((prev) => prev.slice(0, -1));
        if (data.progress_rate !== undefined) {
          setProgressRate(data.progress_rate);
        }
        toast({
          description: "이전 행동이 취소되었습니다.",
        });
        setIsMessageSending(true);
        setTimeout(() => setIsMessageSending(false), 1000);
      } else {
        toast({
          variant: "destructive",
          description: "더 이상 취소할 수 없습니다.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "작업 취소 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUndo}
          className="hover:bg-accent"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1 mx-3">
          <div className="flex flex-col items-center justify-between gap-1">
            <span className="font-medium text-sm">{TITLE}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">진행률</span>
              <div className="flex-1 flex items-center w-48">
                <Progress
                  value={progressRate}
                  className="h-2 flex-1 rounded-full"
                />
                <span className="text-xs text-gray-500 ml-2">
                  {progressRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <DotsHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Chat Content */}
      <div
        ref={chatContentRef}
        className="flex-1 overflow-auto px-4 py-2 space-y-4 [&::-webkit-scrollbar]:hidden"
      >
        {messages.map((message, index) => {
          if (typeof message === 'string') {
            return (
              <div key={index} className="relative group">
                <p
                  className={cn(
                    "text-[15px] leading-[1.6] text-gray-800 break-words whitespace-pre-line",
                    NanumMyeongjo.className
                  )}
                >
                  {/*
                    마지막 메시지이면서 진행 중이면 bufferState.display
                    그 외는 messages[index]
                    (하지만 이제 messages[index]도 타이핑 중에 업데이트되므로
                     사실 bufferState.display가 아니라도 깜빡임 없이 잘 될 것.)
                  */}
                  {index === messages.length - 1 && bufferState.isProcessing
                    ? bufferState.display
                    : message}
                </p>

                {index === messages.length - 1 && !bufferState.isProcessing && (
                  <button
                    onClick={handleUndo}
                    disabled={isMessageSending}
                    className={cn(
                      "absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      "text-gray-400 hover:text-primary disabled:text-gray-300"
                    )}
                  >
                    <UndoIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          } else {
            // 배경 메시지
            return (
              <p
                key={index}
                className={cn(
                  BACKGROUND_MESSAGE_CLASS,
                  "text-[15px] leading-[1.6] break-words whitespace-pre-line",
                  NanumMyeongjo.className
                )}
              >
                {message.content.trim()}
              </p>
            );
          }
        })}
      </div>

      {/* Input Area */}
      <div className="p-4">
        <div className="flex items-center gap-1 bg-neutral-100 rounded-2xl border-none p-2">
          <textarea
            ref={textareaRef}
            onChange={handleTextAreaValueChange}
            onKeyDown={handleKeyDown}
            placeholder="메세지를 입력하세요."
            className={cn(
              "w-full bg-transparent border-none resize-none leading-normal outline-none px-1 text-sm",
              {
                "opacity-50 pointer-events-none": isMessageSending,
              }
            )}
            disabled={isMessageSending}
            rows={1}
          />
          <div className="flex gap-2 items-center justify-center">
            <button
              onClick={handleUndo}
              disabled={isMessageSending || !isInitialized}
            >
              <UndoIcon
                className={cn("w-5 h-5 cursor-pointer text-primary", {
                  "text-gray-400 pointer-events-none":
                    isMessageSending || !isInitialized,
                })}
              />
            </button>
            <button
              onClick={() => handleSendMessage({ auto: true })}
              disabled={isMessageSending || !isInitialized}
            >
              <AutoChat
                className={cn("w-5 h-5 cursor-pointer text-primary", {
                  "text-gray-400 pointer-events-none":
                    isMessageSending || !isInitialized,
                })}
              />
            </button>
            <button
              onClick={() => handleSendMessage({ auto: false })}
              disabled={isMessageSending || !isInitialized}
            >
              <PaperPlane
                className={cn("w-5 h-5 cursor-pointer text-primary", {
                  "text-gray-400 pointer-events-none":
                    isMessageSending || !isInitialized,
                })}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
