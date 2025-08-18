"use client";

import { StoryProvider, useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import ProgressRate from "@/app/novel/[id]/chat/_components/ProgressRate";
import { StoryContent } from "@/app/novel/[id]/chat/_components/StoryContent";
import { ChatInput } from "@/app/novel/[id]/chat/_components/ChatInput";
import NotFound from "@/app/not-found";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function ChatPageContent() {
  const { initError } = useStoryContext();
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(15);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [paragraphSpacing, setParagraphSpacing] = useState(16);
  const [paragraphWidth, setParagraphWidth] = useState(600);
  const [brightness, setBrightness] = useState(1);
  const [font, setFont] = useState("나눔명조");
  
  const isMobile = useIsMobile();
  
  const messageBoxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const stored = localStorage.getItem("novel_brightness");
    if (stored) setBrightness(Number(stored));
  }, []);
  useEffect(() => {
    localStorage.setItem("novel_brightness", String(brightness));
  }, [brightness]);
  const darkColors = ["#3C3C3C", "#000000", "#2B3531"];
  const isDark = darkColors.includes(bgColor);

  if (initError) {
    // 세션 관련 에러인 경우 로그인 안내 페이지 표시
    const errorMessage = (initError as unknown as Error)?.message || String(initError);
    if (errorMessage.includes("세션")) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              로그인이 필요합니다
            </h2>
            <p className="text-gray-600 mb-6">
              세계관에 진입하려면 로그인이 필요합니다.
            </p>
            <a 
              href="/login" 
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              로그인하기
            </a>
          </div>
        </div>
      );
    }
    return <NotFound />;
  }
  return (
    <div
      className="flex flex-col w-full h-screen overflow-hidden"
      style={{ backgroundColor: "#EDEFF3" }}
    >
      {/* 중앙 카드 컨테이너 (헤더 + 콘텐츠) */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-4 pb-24">
        <div 
          className={`w-full ${isMobile ? 'max-w-2xl' : 'max-w-4xl'} h-full flex flex-col rounded-2xl shadow-lg overflow-hidden`}
          style={{
            background: bgColor,
            color: isDark ? "#fff" : "#232325",
            transition: "background 0.2s, color 0.2s",
            filter: `brightness(${brightness})`,
          }}
        >
          {/* 헤더 */}
          <div className="flex-shrink-0 border-b border-gray-300">
            <ProgressRate 
              onColorChange={setBgColor}
              selectedColor={bgColor}
              fontSize={fontSize}
              lineHeight={lineHeight}
              paragraphSpacing={paragraphSpacing}
              paragraphWidth={paragraphWidth}
              onFontSizeChange={setFontSize}
              onLineHeightChange={setLineHeight}
              onParagraphSpacingChange={setParagraphSpacing}
              onParagraphWidthChange={setParagraphWidth}
              brightness={brightness}
              onBrightnessChange={setBrightness}
              font={font}
              onFontChange={setFont}
            />
          </div>
          
          {/* 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto pt-4" ref={messageBoxRef}>
            <StoryContent
              fontSize={fontSize}
              lineHeight={lineHeight}
              paragraphSpacing={paragraphSpacing}
              paragraphWidth={paragraphWidth}
              font={font}
              isDark={isDark}
              messageBoxRef={messageBoxRef}
            />
          </div>
        </div>
      </div>
      {/* 하단 고정 채팅창 (카드 밖) */}
      <div className="fixed bottom-0 left-0 md:left-[80px] right-0 p-4 flex justify-center transition-all duration-300 ease-in-out">
        <div className={`w-full ${isMobile ? 'max-w-2xl' : 'max-w-4xl'}`}>
          <ChatInput />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <StoryProvider>
      <ChatPageContent />
    </StoryProvider>
  );
}
