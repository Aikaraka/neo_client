"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { useEffect, useLayoutEffect, useRef } from "react";
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
  const { background, messages, fetchMoreStories, hasMoreStories, scrollType, prevFetching: _prevFetching, isMessageSending, streamingBackgroundStart, isBackgroundStreaming, protagonist_name, showProtagonistMessage } =
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
  
  useLayoutEffect(() => {
    if (!messageBoxRef.current || !interSectionRef.current) {
      return;
    }
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreStories) {
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
      // 사용자가 맨 밑 근처(100px 이내)에 있을 때만 자동 스크롤
      const isNearBottom = messageBox.scrollHeight - messageBox.scrollTop - messageBox.clientHeight < 30;
      
      if (isNearBottom) {
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
      {/* 배경 설명 - 박스 없이 굵은 글씨로 표시 */}
      <div
        className="whitespace-pre-wrap"
        style={{ 
          fontFamily,
          fontSize: `${fontSize + 2}px`,
          fontWeight: 600,
          lineHeight: lineHeight * 1.2,
          color: isDark ? "#E5E7EB" : "#1F2937",
          marginBottom: `${paragraphSpacing * 1.5}px`,
        }}
      >
        {isBackgroundStreaming || streamingBackgroundStart 
          ? streamingBackgroundStart || ""
          : background?.start ?? "여러분들의 소설을 시작해보세요."
        }
      </div>

      {/* 주인공 소개 메시지 - 그라데이션 효과 */}
      {showProtagonistMessage && protagonist_name && (
        <div
          className="text-center mb-6 py-3 px-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50"
          style={{ 
            fontFamily,
            fontSize: `${fontSize}px`,
            marginBottom: `${paragraphSpacing * 1.5}px`,
          }}
        >
          <span className="text-gray-700">당신의 캐릭터는 </span>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            {protagonist_name}
          </span>
          <span className="text-gray-700"> 입니다. <br /> 멈춘 문장 너머로, 새로운 이야기가 기다립니다.</span>
        </div>
      )}

      {messages.map((msg, i) => {
        if (msg.type === "user") {
          const paragraphs = msg.content.split('\n\n').filter(Boolean);
          return (
            <div key={i}>
              {paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="whitespace-pre-line tracking-wide text-neo-purple"
                  style={{ 
                    color: isDark ? "#BE7AD3" : "#9125B1", 
                    WebkitTextFillColor: isDark ? "#BE7AD3" : "#9125B1", 
                    fontWeight: 200,
                    fontSize: `${fontSize + 2}px`,
                    lineHeight: lineHeight * 1.2,
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
          const paragraphs = msg.content.split('\n\n').filter(Boolean);
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
                    fontSize: `${fontSize + 2}px`,
                    fontWeight: 200,
                    lineHeight: lineHeight * 1.2,
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