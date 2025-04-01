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

export function StoryContent() {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const { background, messages, fetchMoreStories, hasMoreStories, scrollType } =
    useStoryContext();
  const interSectionRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll<HTMLDivElement>({
    observerRef: interSectionRef,
    fetchMore: async () => {
      const prevScrollHeight = messageBoxRef?.current?.scrollHeight ?? 0;
      const prevScrollTop = messageBoxRef?.current?.scrollTop ?? 0;
      await fetchMoreStories();
      setTimeout(() => {
        const newScrollHeight = messageBoxRef?.current?.scrollHeight ?? 0;
        const heightDifference = newScrollHeight - prevScrollHeight;
        messageBoxRef?.current?.scrollTo({
          top: prevScrollTop + heightDifference,
          behavior: "instant",
        });
      }, 0);
    },
    hasMore: hasMoreStories,
  });

  useEffect(() => {
    switch (scrollType) {
      case "smooth":
        messageBoxRef?.current?.scrollTo({
          top: messageBoxRef.current.scrollHeight,
          behavior: "smooth",
        });
        break;
      case "instant":
        messageBoxRef?.current?.scrollTo({
          top: messageBoxRef.current.scrollHeight,
          behavior: "instant",
        });
        break;
      case "none":
        break;
    }
  }, [messages, scrollType]);

  return (
    <div
      ref={messageBoxRef}
      className="flex-1 overflow-auto px-4 py-2 space-y-4"
    >
      <div
        className={`bg-primary p-4 text-white rounded-xl ${NanumMyeongjo.className}`}
      >
        {background?.start ?? "여러분들의 소설을 시작해보세요."}
      </div>
      <div className="h-11" ref={interSectionRef}></div>

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
        }
      })}
    </div>
  );
}
