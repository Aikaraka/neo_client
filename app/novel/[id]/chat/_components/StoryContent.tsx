"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { useInfiniteScroll } from "@/hooks/use-infiniteScroll";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { useEffect, useRef } from "react";

const NanumMyeongjo = localFont({
  src: "../../../../fonts/NanumMyeongjo.ttf",
  weight: "400",
  style: "normal",
});

// 페이드인 애니메이션을 위한 CSS 키프레임
const fadeInKeyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export function StoryContent() {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const {
    background,
    messages,
    fetchMoreStories,
    hasMoreStories,
    scrollType,
    currentUserInput,
    isUserInputVisible,
  } = useStoryContext();
  const interSectionRef = useRef<HTMLDivElement>(null);

  useInfiniteScroll<HTMLDivElement>({
    observerRef: interSectionRef,
    fetchMore: async () => {
      const prevScrollHeight = messageBoxRef?.current?.scrollHeight ?? 0;
      const prevScrollTop = messageBoxRef?.current?.scrollTop ?? 0;
      await fetchMoreStories();
      setTimeout(() => {
        if (messageBoxRef.current) {
          const newScrollHeight = messageBoxRef.current.scrollHeight;
          const heightDifference = newScrollHeight - prevScrollHeight;
          messageBoxRef.current.scrollTo({
            top: prevScrollTop + heightDifference,
            behavior: "instant",
          });
        }
      }, 0);
    },
    hasMore: hasMoreStories,
  });

  useEffect(() => {
    if (!messageBoxRef.current) return;

    switch (scrollType) {
      case "smooth":
        messageBoxRef.current.scrollTo({
          top: messageBoxRef.current.scrollHeight,
          behavior: "smooth",
        });
        break;
      case "instant":
        messageBoxRef.current.scrollTo({
          top: messageBoxRef.current.scrollHeight,
          behavior: "instant",
        });
        break;
      case "none":
        break;
    }
  }, [messages.length, scrollType, isUserInputVisible]);

  return (
    <>
      <style>{fadeInKeyframes}</style>

      <div
        ref={messageBoxRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scroll-smooth"
      >
        <div className="h-11" ref={interSectionRef}></div>

        <div
          className={`bg-primary p-4 text-white rounded-xl ${NanumMyeongjo.className}`}
        >
          {background?.start ?? "여러분들의 소설을 시작해보세요."}
        </div>

        {messages.map((msg, i) => {
          if (typeof msg === "string") {
            return (
              <p
                key={`ai-msg-${i}`}
                className={cn(
                  "ai-message text-[15px] leading-[1.6] text-gray-800 whitespace-pre-line",
                  NanumMyeongjo.className
                )}
              >
                {msg}
              </p>
            );
          }
          return null;
        })}

        {isUserInputVisible && currentUserInput && (
          <div
            key="user-input"
            style={{ animation: "fadeIn 0.3s ease forwards" }}
            className={cn(
              "user-input bg-blue-100 p-3 rounded-lg border-l-4 border-blue-500 text-[15px] leading-[1.6] text-gray-800 whitespace-pre-line",
              NanumMyeongjo.className
            )}
          >
            {currentUserInput}
          </div>
        )}
      </div>
    </>
  );
}
