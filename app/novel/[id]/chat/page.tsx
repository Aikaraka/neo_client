"use client";

import { StoryProvider, useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import ProgressRate from "@/app/novel/[id]/chat/_components/ProgressRate";
import { StoryContent } from "@/app/novel/[id]/chat/_components/StoryContent";
import { ChatInput } from "@/app/novel/[id]/chat/_components/ChatInput";
import { ImageArchive } from "@/app/novel/[id]/chat/_components/ImageArchive";
import NotFound from "@/app/not-found";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, Sparkles } from "lucide-react";

function ChatPageContent() {
  const { initError, archivedImages, isGeneratingImage, progressRate } = useStoryContext();
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(15);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [paragraphSpacing, setParagraphSpacing] = useState(24);
  const [paragraphWidth, setParagraphWidth] = useState(600);
  const [brightness, setBrightness] = useState(1);
  const [font, setFont] = useState("나눔명조");
  const [showImageArchive, setShowImageArchive] = useState(false);
  
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
      className="flex flex-col w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: "#EAECF0" }}
    >
      {/* 중앙 카드 컨테이너 (헤더 + 콘텐츠) - 고정 크기 */}
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
            <div className="flex items-center justify-between p-2">
              <div className="flex-1">
                <ProgressRate 
                  onShowImageArchive={() => setShowImageArchive(true)}
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
            </div>
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
      
      {/* 이미지 보관함 슬라이드 패널 */}
      {isMobile ? (
        /* 모바일: 전체 화면 오버레이 */
        showImageArchive && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">이미지 보관함</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageArchive(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <ImageArchive />
              </div>
            </div>
          </div>
        )
      ) : (
        /* 데스크톱: 오른쪽 슬라이드 패널 */
        <div 
          className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
            showImageArchive ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-lg">이미지 보관함</h3>
                        <p className="text-sm text-gray-500">진행률: {progressRate}%</p>
                    </div>
                </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageArchive(false)}
                className="text-gray-600 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              {archivedImages.length === 0 && !isGeneratingImage ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-purple-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">아직 생성된 이미지가 없습니다</h4>
                  <p className="text-gray-500 text-center text-sm leading-relaxed max-w-xs">
                    캐릭터 에셋이 존재하면 진행률 <span className="font-medium text-purple-600">20%, 40%, 60%, 80%, 100%</span>에 도달하면 
                    <br />이미지가 자동으로 생성됩니다
                  </p>
                </div>
              ) : (
                <ImageArchive />
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 데스크톱에서 패널이 열려있을 때 배경 오버레이 */}
      {showImageArchive && !isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setShowImageArchive(false)}
        />
      )}
      
      {/* 하단 고정 채팅창 */}
      <div className="fixed bottom-0 left-0 md:left-[80px] right-0 p-4 flex justify-center transition-all duration-300 ease-in-out z-20">
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