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

// interface RequestBody {
//   text: string;
//   persona_name: string;
// }

interface Response {
  story: string;
  // new_characters: Array<unknown>;
  // participating_characters: Array<string>;
  // story_elements: Array<unknown>;
  progress_rate: number;
  // available_elements: Array<unknown>;
  // recent_memories: Array<string>;
}

const TEXTAREA_MAX_HEIGHT = 100;
const API_URL = "http://15.152.208.196:8000";

// 나눔명조 폰트 적용해주기

export default function Component() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isMessageSending, setIsMessageSending] = useState(false);

  const [displayText, setDisplayText] = useState<string[]>();
  const [progressRate, setProgressRate] = useState<number>();

  const { toast } = useToast();

  useEffect(() => {
    let currentCharIndex = 0;
    let currentTextIndex = 0;
    const timeoutIds: NodeJS.Timeout[] = [];

    const animateText = () => {
      if (displayText === undefined || currentTextIndex >= displayText.length)
        return;

      const currentLine = displayText[currentTextIndex];
      if (currentCharIndex >= currentLine.length) {
        currentTextIndex++;
        currentCharIndex = 0;
        if (currentTextIndex < displayText.length) {
          timeoutIds.push(setTimeout(animateText, 1000));
        }
        return;
      }

      setDisplayText((prev) => {
        const newText = [...(prev ?? [])];
        if (!newText[currentTextIndex]) {
          newText[currentTextIndex] = "";
        }
        newText[currentTextIndex] = currentLine.slice(0, currentCharIndex + 1);
        return newText;
      });

      currentCharIndex++;
      timeoutIds.push(setTimeout(animateText, 100));
    };

    timeoutIds.push(setTimeout(animateText, 500));

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [displayText]);

  useEffect(() => {
    const initializeStory = async () => {
      try {
        const res = await fetch(`${API_URL}/init-story`, {
          method: "POST",
        });
        const data = await res.json();
        setDisplayText(data.split("\n"));
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
    if (progressRate === undefined) {
      return toast({
        title: "오류가 발생했습니다.",
        description: "초기화 과정에서 오류가 발생했습니다.",
      });
    }
    const current = textareaRef.current;
    if (!current) return;

    const sendMessage = async (auto?: boolean) => {
      setIsMessageSending(true);
      try {
        const res = await fetch(`${API_URL}/process-input`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: auto ? "계속 진행해주세요." : current.value,
            persona_name: "아린",
          }),
        });
        const data = (await res.json()) as Response;
        setDisplayText(data.story.split("\n"));
        setProgressRate(data.progress_rate);
      } catch (error) {
        console.error(error);
        toast({
          title: "오류가 발생했습니다.",
          description: "메세지 전송 과정에서 오류가 발생했습니다.",
        });
      } finally {
        setIsMessageSending(false);
        current.value = "";
        current.scrollTop = current.scrollHeight;
      }
    };

    if (auto) {
      sendMessage(auto);
    } else if (current.value.trim() !== "") {
      sendMessage();
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
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 mx-3">
          <div className="flex flex-col items-center justify-between gap-1">
            <span className="font-medium text-sm">일곱난쟁이와 백설공주</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">진행률</span>
              <div className="flex-1 flex items-center">
                <Progress
                  value={13}
                  className="h-1 flex-1 rounded-full" // 진행률 안나오는 버그 수정하기
                  indicatorClassName="bg-purple-600"
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
      <div className="flex-1 overflow-auto px-4 py-2 space-y-4">
        {displayText?.map((line, index) => (
          <p
            key={index}
            className="text-[15px] leading-[1.6] text-gray-800 break-words"
          >
            {line}
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
          <div className="flex gap-2 items-center justify-center p-">
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
