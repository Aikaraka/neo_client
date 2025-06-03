import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { Button } from "@/components/ui/button";
import { AutoChat, PaperPlane } from "@/public/novel/chat";
import { FormEventHandler, KeyboardEvent, useRef, useState, useEffect } from "react";
import { UndoIcon } from "lucide-react";
import { ViewSettingsPanel } from "./ViewSettingsPanel";

export function ChatInput({ onColorChange, selectedColor, fontSize, lineHeight, paragraphSpacing, paragraphWidth, onFontSizeChange, onLineHeightChange, onParagraphSpacingChange, onParagraphWidthChange, brightness, onBrightnessChange, font, onFontChange }: {
  onColorChange?: (color: string) => void,
  selectedColor: string,
  fontSize: number,
  lineHeight: number,
  paragraphSpacing: number,
  paragraphWidth: number,
  onFontSizeChange: (size: number) => void,
  onLineHeightChange: (lh: number) => void,
  onParagraphSpacingChange: (ps: number) => void,
  onParagraphWidthChange: (width: number) => void,
  brightness: number,
  onBrightnessChange: (brightness: number) => void,
  font: string,
  onFontChange: (font: string) => void,
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendNovelProcessMessage, isMessageSending, undoStory } = useStoryContext();
  const [isViewSettings, setIsViewSettings] = useState(false);
  const [isBookmarkModal, setIsBookmarkModal] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTextAreaChange: FormEventHandler<HTMLTextAreaElement> = (e) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = textareaRef.current?.value;
      sendNovelProcessMessage(!value, value);
      textareaRef.current!.value = "";
    }
    
    // * 키 입력 시 ** 자동 완성
    if (e.key === "*" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        
        // ** 삽입
        const newValue = value.slice(0, start) + "**" + value.slice(end);
        textarea.value = newValue;
        
        // 커서를 * 사이에 위치
        textarea.setSelectionRange(start + 1, start + 1);
        textarea.focus();
        
        // 높이 재계산
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
      }
    }
  };

  const handleNovelProcess = (auto: boolean) => {
    if (auto) {
      sendNovelProcessMessage(true);
    }
    if (textareaRef.current?.value) {
      sendNovelProcessMessage(false, textareaRef.current?.value);
    }
    textareaRef.current!.value = "";
  };

  const handleBookmarkClick = () => {
    setIsBookmarkModal(true);
  };

  const handleAsteriskClick = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      // ** 삽입
      const newValue = value.slice(0, start) + "**" + value.slice(end);
      textarea.value = newValue;
      
      // 커서를 * 사이에 위치
      textarea.setSelectionRange(start + 1, start + 1);
      textarea.focus();
      
      // 높이 재계산
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  const BookmarkModal = () => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setIsBookmarkModal(false)}
    >
      <div 
        className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-lg font-medium mb-4" style={{ fontFamily: 'NanumSquare Neo OTF' }}>
            📚 책갈피
          </div>
          <div className="text-gray-600 mb-6" style={{ fontFamily: 'NanumSquare Neo OTF' }}>
            곧 추가될 기능이에요 !
          </div>
          <button
            onClick={() => setIsBookmarkModal(false)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            style={{ fontFamily: 'NanumSquare Neo OTF' }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full" style={{ 
      background: "#F5F5F5", 
      position: "relative", 
      padding: isMobile ? "0 0 16px 0" : "0 0 24px 0",
      maxWidth: "100%",
      overflow: "hidden"
    }}>
      {/* 기존 astroid, 입력창, 버튼 등 전체 UI 항상 렌더링 */}
      {/* 구분선 (astroid 위) */}
      <div style={{ height: 1, background: "#DEDEDE", margin: "0 0 8px 0" }} />
      {/* 첫 줄: astroid 아이콘 */}
      <div className="flex items-center" style={{ 
        height: isMobile ? 32 : 40, 
        paddingLeft: isMobile ? 16 : 24, 
        paddingTop: 0 
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/novel/chat/astroid.svg" 
          alt="astroid" 
          width={isMobile ? 24 : 32} 
          height={isMobile ? 24 : 32}
          onClick={handleAsteriskClick}
          style={{ cursor: "pointer" }}
        />
      </div>
      {/* 두 번째 줄: 입력창 + ai/전송/undo 버튼 */}
      <div className="flex items-center w-full" style={{ 
        justifyContent: "center", 
        marginBottom: isMobile ? 8 : 12,
        paddingLeft: isMobile ? 16 : 24,
        paddingRight: isMobile ? 16 : 24
      }}>
        <div className="flex items-center bg-[#EDEDEE] rounded-full w-full" style={{ 
          paddingLeft: isMobile ? 16 : 24,
          paddingRight: isMobile ? 12 : 16,
          paddingTop: isMobile ? 8 : 12,
          paddingBottom: isMobile ? 8 : 12,
          minHeight: isMobile ? 40 : 48,
          maxWidth: "800px"
        }}>
          <textarea
            ref={textareaRef}
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="대화를 입력하여 소설을 작성하세요."
            className="flex-1 bg-[#EDEDEE] rounded-full p-0 resize-none leading-relaxed focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-[#868D96]"
            style={{ 
              color: "#232325", 
              fontSize: isMobile ? 15 : 17, 
              fontFamily: 'NanumSquare Neo OTF', 
              resize: "none", 
              overflow: "hidden",
              maxHeight: isMobile ? 40 : 60,
              minWidth: 0
            }}
            disabled={isMessageSending}
          ></textarea>
          {/* 버튼 그룹: Undo, AI, Send */}
          <div className="flex ml-2 flex-shrink-0" style={{ gap: isMobile ? 8 : 12 }}>
            <Button
              variant={"link"}
              className={`text-primary p-0 flex items-center justify-center ${isMobile ? '[&_svg]:size-5' : '[&_svg]:size-6'} min-w-[${isMobile ? '24px' : '28px'}]`}
              onClick={undoStory}
              disabled={isMessageSending}
            >
              <UndoIcon />
            </Button>
            <Button
              variant={"link"}
              className={`text-primary ${isMessageSending ? "opacity-50" : "cursor-pointer"} p-0 flex items-center justify-center ${isMobile ? '[&_svg]:size-5' : '[&_svg]:size-6'} min-w-[${isMobile ? '24px' : '28px'}]`}
              disabled={isMessageSending}
              onClick={() => handleNovelProcess(true)}
            >
              <AutoChat viewBox="0 0 24 24" />
            </Button>
            <Button
              variant={"link"}
              onClick={() => handleNovelProcess(false)}
              aria-disabled={isMessageSending}
              className={`text-primary ${isMessageSending ? "opacity-50" : "cursor-pointer"} p-0 flex items-center ${isMobile ? '[&_svg]:size-5' : '[&_svg]:size-6'} min-w-[${isMobile ? '24px' : '28px'}]`}
            >
              <PaperPlane />
            </Button>
          </div>
        </div>
      </div>
      {/* 세 번째 줄: 책갈피(왼쪽), 보기 설정(가운데), 빈칸(오른쪽) */}
      <div className="flex items-center justify-between mt-2" style={{ 
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48
      }}>
        {/* 책갈피 버튼 (왼쪽) */}
        <button 
          className="flex flex-col items-center justify-center" 
          style={{ color: "#868D96" }}
          onClick={handleBookmarkClick}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/novel/chat/bookmark.svg" 
            alt="bookmark" 
            width={isMobile ? 24 : 28} 
            height={isMobile ? 24 : 28} 
          />
          <span className="mt-1" style={{ 
            fontFamily: 'NanumSquare Neo OTF',
            fontSize: isMobile ? 12 : 14
          }}>책갈피</span>
        </button>
        {/* 보기 설정 버튼 (가운데) */}
        <button
          className="flex flex-col items-center justify-center"
          style={{ color: "#868D96" }}
          onClick={() => setIsViewSettings(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/novel/chat/text-edit.svg" 
            alt="text-edit" 
            width={isMobile ? 24 : 28} 
            height={isMobile ? 24 : 28} 
          />
          <span className="mt-1" style={{ 
            fontFamily: 'NanumSquare Neo OTF',
            fontSize: isMobile ? 12 : 14
          }}>보기 설정</span>
        </button>
        {/* 빈칸 (오른쪽, 추후 버튼 자리) */}
        <div style={{ 
          width: isMobile ? 40 : 48, 
          height: isMobile ? 40 : 48 
        }} />
      </div>
      {/* 설정 모달은 입력창 위에 겹쳐서 렌더링 */}
      {isViewSettings && (
        <ViewSettingsPanel
          onClose={() => setIsViewSettings(false)}
          onColorChange={onColorChange}
          selectedColor={selectedColor}
          fontSize={fontSize}
          onFontSizeChange={onFontSizeChange}
          lineHeight={lineHeight}
          onLineHeightChange={onLineHeightChange}
          paragraphSpacing={paragraphSpacing}
          onParagraphSpacingChange={onParagraphSpacingChange}
          paragraphWidth={paragraphWidth}
          onParagraphWidthChange={onParagraphWidthChange}
          brightness={brightness}
          onBrightnessChange={onBrightnessChange}
          font={font}
          onFontChange={onFontChange}
        />
      )}
      {isBookmarkModal && <BookmarkModal />}
    </div>
  );
}
