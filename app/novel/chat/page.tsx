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
const DESCRIPTION =
  " 아에토리아는 마법과 과학이 완벽하게 융합된 독특한 세계입니다. 이곳은 자연의 원리를 이해하고 조작하는 과학과, 신비로운 에너지인 마나를 기반으로 한 마법이 상호작용하며 공존하는 곳입니다. 사람들이 마법을 배우면서도 첨단 기술을 일상적으로 사용하는 모습을 볼 수 있습니다. 예를 들어, 마법으로 구동되는 기계나 마법 에너지로 움직이는 비행선, 그리고 마법사와 과학자가 함께 개발한 치유 기계가 대표적입니다. 이러한 세계는 인간과 다른 종족들이 함께 거주하며 조화를 이루고 있지만, 과거에는 마법과 과학 간의 갈등이 심했던 역사를 가지고 있습니다.\n\n세계의 설정\n마법과 과학의 융합\n아에토리아에서는 마법을 단순히 신비로운 힘으로만 보지 않습니다. 마법은 과학적 원리로 분석되고 연구됩니다. 과학자들은 마법의 구조와 에너지를 연구하여 새로운 기계를 발명하고, 마법사들은 과학을 응용해 더 정교한 주문을 개발합니다. 이 두 분야는 경쟁적이면서도 협력적인 관계를 유지하고 있습니다.\n\n다양한 종족과 문명\n아에토리아는 인간뿐 아니라 엘프, 드워프, 고블린 등 다양한 종족이 공존하는 세계입니다. 각 종족은 자신들만의 독특한 문화를 가지고 있으며, 마법이나 과학을 다루는 방식도 다릅니다. 엘프는 자연의 마법에 능하고, 드워프는 마법 공학에 정통하며, 인간은 두 분야를 융합하는 데 가장 탁월한 능력을 보여줍니다.\n\n갈등과 미스터리\n아에토리아는 겉보기엔 평화로워 보이지만, 이면에는 깊은 갈등이 존재합니다. 과학 중심의 도시 국가와 마법 중심의 전통 왕국 사이의 긴장, 금지된 고대 마법의 부활, 마나의 고갈을 막기 위한 연구 등 다양한 문제가 얽혀 있습니다. 주인공은 이 갈등의 한가운데에 서서, 자신의 선택에 따라 세계의 미래가 결정되는 중요한 순간들을 마주하게 됩니다.\n\n마법과 과학의 경계에서\n주인공은 현실에서의 과학적 사고방식을 활용해 마법과 과학을 연결하는 새로운 접근법을 제시하며, 아에토리아의 기존 질서를 뒤흔들 수 있는 혁신적인 인물로 성장합니다. 그 과정에서 그는 자신의 세계에서 가져온 지식과 이곳의 마법적 가능성을 결합해 이세계에서만 가능한 독특한 무기나 도구를 개발할 수도 있습니다.\n\n아린은 평범한 현대 사회에서 살던 인물로, 어느 날 집에 가던 중 갑작스런 교통사고로 인해 아에토리아로 떨어집니다. 이곳에서 그녀는 자신이 현실에서는 상상조차 할 수 없었던 능력을 발견하거나, 아에토리아의 독특한 기술과 마법에 적응해야 합니다. 하지만 단순히 적응하는 데서 끝나는 것이 아니라, 당신은 이세계로 불려온 이유나 배후의 음모를 밝혀야 합니다.";

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
  const chatContentRef = useRef<HTMLDivElement>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isMessageSending, setIsMessageSending] = useState(false);

  const [animatedText, setAnimatedText] = useState<string[]>([]);
  const [originalText, setOriginalText] = useState<string[]>();
  const [stackedText, setStackedText] = useState<string[]>([]);

  const loadText = (text: string[]) => {
    if (originalText) {
      setStackedText((prev) => [...prev, ...originalText]);
    }
    setOriginalText(text);
  };

  const [progressRate, setProgressRate] = useState<number>();

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    let currentCharIndex = 0;
    let currentLineText = "";
    const timeoutIds: NodeJS.Timeout[] = [];

    const animateText = () => {
      if (!originalText || originalText.length === 0) return;

      const fullText = originalText.join("\n");

      if (currentCharIndex >= fullText.length) {
        return;
      }

      currentLineText += fullText[currentCharIndex];
      const lines = currentLineText.split("\n");

      setAnimatedText(lines);

      if (chatContentRef.current) {
        chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
      }

      currentCharIndex++;
      timeoutIds.push(setTimeout(animateText, 50));
    };

    timeoutIds.push(setTimeout(animateText, 500));

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [originalText]); // originalText가 변경될 때만 실행

  useEffect(() => {
    const initializeStory = async () => {
      try {
        const res = await fetch(`${API_URL}/init-story`, {
          method: "POST",
        });
        const data = await res.json();
        loadText(data.split("\n")); // loadText 함수 사용
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
        loadText(data.story.split("\n")); // loadText 함수 사용
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
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            router.back();
          }}
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
        {stackedText.map((line, index) => (
          <p
            key={`stacked-${index}`}
            className={cn(
              "text-[15px] leading-[1.6] text-gray-800 break-words",
              NanumMyeongjo.className
            )}
          >
            {line}
          </p>
        ))}
        {animatedText?.map((line, index) => (
          <p
            key={`animated-${index}`}
            className={cn(
              "text-[15px] leading-[1.6] text-gray-800 break-words",
              NanumMyeongjo.className
            )}
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
