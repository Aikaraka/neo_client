"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { useInfiniteScroll } from "@/hooks/use-infiniteScroll";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { useEffect, useRef } from "react";
import { splitChatParagraphs } from "@/utils/splitChatParagraphs";

const NanumMyeongjo = localFont({
  src: "../../../../fonts/NanumMyeongjo.ttf",
  weight: "400",
  style: "normal",
});

export function StoryContent({ isDark, fontSize, lineHeight, paragraphSpacing, paragraphWidth }: { isDark: boolean, fontSize: number, lineHeight: number, paragraphSpacing: number, paragraphWidth: number }) {
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
        className={`${NanumMyeongjo.className}`}
        style={{ background: '#A259D9', color: '#fff', borderRadius: 12, padding: 16 }}
      >
        {background?.start ?? "여러분들의 소설을 시작해보세요."}
      </div>
      <div className="h-11" ref={interSectionRef}></div>

      {messages.map((msg, i) => {
        if (msg.type === "user") {
          const paragraphs = splitChatParagraphs(msg.content);
          const userColor = isDark ? "#BE7AD3" : "#A259D9";
          return (
            <div key={i} style={{ maxWidth: paragraphWidth, width: '100%', margin: '0 auto' }}>
              {paragraphs.map((p, j) => (
                <p
                  key={j}
                  className={cn(
                    "text-[15px] leading-[1.6] whitespace-pre-line tracking-wide my-6",
                    NanumMyeongjo.className
                  )}
                  style={{ color: userColor, fontSize, lineHeight, marginBottom: paragraphSpacing * 1.5 }}
                >
                  {p}
                </p>
              ))}
            </div>
          );
        } else if (msg.type === "ai") {
          const paragraphs = splitChatParagraphs(msg.content);
          const aiColor = isDark ? "#fff" : "#232325";
          return (
            <div key={i} style={{ maxWidth: paragraphWidth, width: '100%', margin: '0 auto' }}>
              {paragraphs.map((p, j) => (
                <p
                  key={j}
                  className={cn(
                    "text-[15px] leading-[1.6] whitespace-pre-line tracking-wide my-3",
                    NanumMyeongjo.className
                  )}
                  style={{ color: aiColor, fontSize, lineHeight, marginBottom: paragraphSpacing }}
                >
                  {p}
                </p>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
}
