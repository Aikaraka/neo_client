"use client";

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

const NanumMyeongjo = localFont({
  src: "../../fonts/NanumMyeongjo.ttf",
  weight: "400",
  style: "normal",
});

const TITLE = "천공의 연금술사";
const TEXTAREA_MAX_HEIGHT = 100;
const API_URL = "http://15.152.208.196:8000";

export default function Component() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [progressRate, setProgressRate] = useState<number>(0);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const initializeStory = async () => {
      try {
        const res = await fetch(`${API_URL}/init-story`, {
          method: "POST",
        });
        const data = await res.text();
        setMessages([data]);
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

  const handleSendMessage = async ({ auto }: { auto?: boolean }) => {
    const current = textareaRef.current;
    if (!current) return;

    setIsMessageSending(true);
    try {
      const response = await fetch(`${API_URL}/process-input`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: auto ? "계속 진행해주세요." : current.value,
          persona_name: "아린"
        })
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      let currentStory = "";

      const decoder = new TextDecoder('utf-8');
      let { value, done } = await reader.read();
      while (!done) {
        const chunkValue = decoder.decode(value);
        const lines = chunkValue.split('\n');

        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const dataStr = line.trim().substring(6);
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const data = JSON.parse(dataStr);

              if (data.type === 'story') {
                let content = data.content;
                content = content.replace('<END_OF_STORY>', '');
                currentStory += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  if (newMessages.length > 0) {
                    newMessages[newMessages.length - 1] = currentStory;
                  } else {
                    newMessages.push(currentStory);
                  }
                  return newMessages;
                });
              }

              if (data.type === 'progress') {
                setProgressRate(data.progress_rate);
              }

            } catch (error) {
              console.error('JSON 파싱 오류:', error);
            }
          }
        }

        ({ value, done } = await reader.read());
      }

      current.value = "";

    } catch (error) {
      console.error('메시지 전송 오류:', error);
      toast({
        title: "오류가 발생했습니다.",
        description: "메시지 전송 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsMessageSending(false);
    }
  };

  const handleTextAreaValueChange: FormEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    const current = event.target as HTMLTextAreaElement;
    current.style.height = "auto";
    current.style.height =
      Math.min(current.scrollHeight, TEXTAREA_MAX_HEIGHT) + "px";
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      handleSendMessage({ auto: false });
      event.preventDefault();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
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
        {messages.map((message, index) => (
          <p
            key={index}
            className={cn(
              "text-[15px] leading-[1.6] text-gray-800 break-words",
              NanumMyeongjo.className
            )}
          >
            {message}
          </p>
        ))}
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