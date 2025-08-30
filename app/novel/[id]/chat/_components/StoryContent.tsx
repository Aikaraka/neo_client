"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { useEffect, useLayoutEffect, useRef } from "react";
import { splitChatParagraphs } from "@/utils/splitChatParagraphs";
import Image from "next/image";

interface StoryContentProps {
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
  paragraphWidth: number;
  font: string;
  isDark?: boolean;
  messageBoxRef: React.RefObject<HTMLDivElement>;
}

export function StoryContent({ fontSize, lineHeight, paragraphSpacing, paragraphWidth, font, isDark = false, messageBoxRef }: StoryContentProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { background, messages, fetchMoreStories, hasMoreStories, scrollType, prevFetching: _prevFetching, isMessageSending } =
    useStoryContext();
  const interSectionRef = useRef<HTMLDivElement>(null);
  
  console.log("[StoryContent] Messages received:", messages);

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
  
  // 렌더링 시점마다 ref 상태 출력
  console.log("[StoryContent render] messageBoxRef.current:", messageBoxRef.current);
  console.log("[StoryContent render] interSectionRef.current:", interSectionRef.current);

  useLayoutEffect(() => {
    console.log("[StoryContent useLayoutEffect] 실행됨");
    console.log("[StoryContent useLayoutEffect] messageBoxRef.current:", messageBoxRef.current);
    console.log("[StoryContent useLayoutEffect] interSectionRef.current:", interSectionRef.current);
    if (!messageBoxRef.current || !interSectionRef.current) {
      console.log("observer not attached: ref missing", { messageBox: messageBoxRef.current, interSection: interSectionRef.current });
      return;
    }
    console.log("observer attached", { messageBox: messageBoxRef.current, interSection: interSectionRef.current });
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreStories) {
          console.log("IntersectionObserver: 최상단 감지됨, fetchMoreStories 호출");
          // 스크롤 보정 로직
          const messageBox = messageBoxRef.current;
          if (!messageBox) return;
          
          const prevScrollHeight = messageBox.scrollHeight;
          const prevScrollTop = messageBox.scrollTop;
          fetchMoreStories().then(() => {
            setTimeout(() => {
              const currentMessageBox = messageBoxRef.current;
              if (!currentMessageBox) return;
              
              const newScrollHeight = currentMessageBox.scrollHeight;
              const heightDifference = newScrollHeight - prevScrollHeight;
              currentMessageBox.scrollTo({
                top: prevScrollTop + heightDifference,
                behavior: "instant",
              });
            }, 0);
          });
        } else {
          console.log("IntersectionObserver: not intersecting", entries[0]);
        }
      },
      { root: messageBoxRef.current, threshold: 0.3 }
    );
    observer.observe(interSectionRef.current);
    return () => observer.disconnect();
  }, [messageBoxRef, interSectionRef, hasMoreStories, fetchMoreStories]);

  useEffect(() => {
    const messageBox = messageBoxRef.current;
    if (messageBox) {
      switch (scrollType) {
        case "smooth":
          messageBox.scrollTo({
            top: messageBox.scrollHeight,
            behavior: "smooth",
          });
          break;
        case "instant":
          messageBox.scrollTo({
            top: messageBox.scrollHeight,
            behavior: "instant",
          });
          break;
        case "none":
          break;
      }
    }
  }, [messages, scrollType, messageBoxRef]);

  return (
    <div
      ref={messageBoxRef}
      className="flex-1 overflow-auto px-4 py-2 space-y-4"
      style={{ 
        maxWidth: paragraphWidth,
        margin: "0 auto",
      }}
    >
      <div ref={interSectionRef} style={{ height: 1 }} />
      <div
        className={`bg-purple-100 p-4 text-gray-800 rounded-xl whitespace-pre-wrap`}
        style={{ fontFamily }}
      >
        {background?.start ?? "여러분들의 소설을 시작해보세요."}
      </div>

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
                    color: isDark ? "#BE7AD3" : "#9125B1", 
                    WebkitTextFillColor: isDark ? "#BE7AD3" : "#9125B1", 
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
          const paragraphs = splitChatParagraphs(msg.content)
          return (
            <div key={i}>
              {msg.image_url && (
                <div className="relative w-full aspect-video mb-4">
                  <Image
                    src={msg.image_url}
                    alt={`Story image ${i}`}
                    fill={true}
                    className="rounded-lg object-contain"
                  />
                </div>
              )}
              {paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="text-gray-800 whitespace-pre-line tracking-wide"
                  style={{ 
                    color: isDark ? "#fff" : undefined,
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
      {isMessageSending && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-pulse">
            <p style={{ fontFamily, color: isDark ? "#fff" : "#232325" }}>
              Neo가 소설을 작성중이에요...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}