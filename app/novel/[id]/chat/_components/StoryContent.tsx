"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { useInfiniteScroll } from "@/hooks/use-infiniteScroll";
import { useEffect, useRef } from "react";
import { splitChatParagraphs } from "@/utils/splitChatParagraphs";

interface StoryContentProps {
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
  paragraphWidth: number;
  font: string;
}

export function StoryContent({ fontSize, lineHeight, paragraphSpacing, paragraphWidth, font }: StoryContentProps) {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const { background, messages, fetchMoreStories, hasMoreStories, scrollType } =
    useStoryContext();
  const interSectionRef = useRef<HTMLDivElement>(null);
  
  // 폰트 매핑
  const getFontFamily = (fontName: string) => {
    switch (fontName) {
      case "나눔고딕":
        return "'NanumGothic', sans-serif";
      case "나눔명조":
        return "'NanumMyeongjo', serif";
      case "KoPubWorld 돋움체":
        return "'KoPubWorldDotum', sans-serif";
      case "KoPubWorld 바탕체":
        return "'KoPubWorldBatang', serif";
      default:
        return "'NanumMyeongjo', serif";
    }
  };
  
  const fontFamily = getFontFamily(font);
  
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
      style={{ 
        maxWidth: paragraphWidth,
        margin: "0 auto",
      }}
    >
      <div
        className={`bg-primary p-4 text-white rounded-xl`}
        style={{ fontFamily }}
      >
        {background?.start ?? "여러분들의 소설을 시작해보세요."}
      </div>
      <div className="h-11" ref={interSectionRef}></div>

      {messages.map((msg, i) => {
        if (msg.type === "user") {
          const paragraphs = splitChatParagraphs(msg.content);
          return (
            <div key={i}>
              {paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="whitespace-pre-line tracking-wide text-neo-purple"
                  style={{ 
                    color: "#9125B1", 
                    WebkitTextFillColor: "#9125B1", 
                    fontWeight: 400,
                    fontSize: `${fontSize}px`,
                    lineHeight: lineHeight,
                    marginBottom: `${paragraphSpacing}px`,
                    marginTop: `${paragraphSpacing}px`,
                    textAlign: "left",
                    fontFamily,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          );
        } else if (msg.type === "ai") {
          const paragraphs = splitChatParagraphs(msg.content);
          return (
            <div key={i}>
              {paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="text-gray-800 whitespace-pre-line tracking-wide"
                  style={{ 
                    fontSize: `${fontSize}px`,
                    lineHeight: lineHeight,
                    marginBottom: `${paragraphSpacing / 2}px`,
                    marginTop: `${paragraphSpacing / 2}px`,
                    textAlign: "left",
                    fontFamily,
                  }}
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