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
  const chatInputBoxRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full" style={{ position: 'relative', background: isMobile ? "#F5F5F5" : "transparent", padding: isMobile ? "0 0 16px 0" : "0", maxWidth: "100%", overflow: "hidden" }}>
      {isMobile ? (
        // 모바일: 기존 UI 100% 유지
        <>
          {/* 구분선 (astroid 위) */}
          <div style={{ height: 1, background: "#DEDEDE", margin: "0 0 8px 0" }} />
          {/* 첫 줄: astroid 아이콘 */}
          <div className="flex items-center" style={{
            height: 32,
            paddingLeft: 16,
            paddingTop: 0
          }}>
            <img
              src="/novel/chat/astroid.svg"
              alt="astroid"
              width={24}
              height={24}
              onClick={handleAsteriskClick}
              style={{ cursor: "pointer" }}
            />
          </div>
          {/* 입력창 + 버튼 */}
          <div className="flex items-center w-full" style={{
            justifyContent: "center",
            marginBottom: 8,
            paddingLeft: 16,
            paddingRight: 16
          }}>
            <div className="flex items-center bg-[#EDEDEE] rounded-full w-full" style={{
              paddingLeft: 16,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
              minHeight: 40,
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
                  fontSize: 15,
                  fontFamily: "NanumSquare Neo, Malgun Gothic, Apple SD Gothic Neo, sans-serif",
                  resize: "none",
                  overflow: "hidden",
                  maxHeight: 40,
                  minWidth: 0
                }}
                disabled={isMessageSending}
              ></textarea>
              {/* 버튼 그룹: Undo, AI, Send */}
              <div className="flex ml-2 flex-shrink-0" style={{ gap: 8 }}>
                <Button
                  variant={"link"}
                  className="text-primary p-0 flex items-center justify-center [&_svg]:size-5 min-w-[24px]"
                  onClick={undoStory}
                  disabled={isMessageSending}
                >
                  <UndoIcon />
                </Button>
                <Button
                  variant={"link"}
                  className={`text-primary ${isMessageSending ? "opacity-50" : "cursor-pointer"} p-0 flex items-center justify-center [&_svg]:size-5 min-w-[24px]`}
                  disabled={isMessageSending}
                  onClick={() => handleNovelProcess(true)}
                >
                  <AutoChat viewBox="0 0 24 24" />
                </Button>
                <Button
                  variant={"link"}
                  onClick={() => handleNovelProcess(false)}
                  aria-disabled={isMessageSending}
                  className={`text-primary ${isMessageSending ? "opacity-50" : "cursor-pointer"} p-0 flex items-center [&_svg]:size-5 min-w-[24px]`}
                >
                  <PaperPlane />
                </Button>
              </div>
            </div>
          </div>
          {/* 세 번째 줄: 책갈피(왼쪽), 보기 설정(가운데), 빈칸(오른쪽) */}
          <div className="flex items-center justify-between mt-2" style={{
            paddingLeft: 24,
            paddingRight: 24
          }}>
            {/* 책갈피 버튼 (왼쪽) */}
            <button
              className="flex flex-col items-center justify-center"
              style={{ color: "#868D96" }}
              onClick={handleBookmarkClick}
            >
              <img
                src="/novel/chat/bookmark.svg"
                alt="bookmark"
                width={24}
                height={24}
              />
              <span className="mt-1" style={{
                fontFamily: 'NanumSquare Neo, Malgun Gothic, Apple SD Gothic Neo, sans-serif',
                fontSize: 12
              }}>책갈피</span>
            </button>
            {/* 보기 설정 버튼 (가운데) */}
            <button
              className="flex flex-col items-center justify-center"
              style={{ color: "#868D96" }}
              onClick={() => setIsViewSettings(true)}
            >
              <img
                src="/novel/chat/text-edit.svg"
                alt="text-edit"
                width={24}
                height={24}
              />
              <span className="mt-1" style={{
                fontFamily: 'NanumSquare Neo, Malgun Gothic, Apple SD Gothic Neo, sans-serif',
                fontSize: 12
              }}>보기 설정</span>
            </button>
            {/* 빈칸 (오른쪽, 추후 버튼 자리) */}
            <div style={{ width: 40, height: 40 }} />
          </div>
        </>
      ) : (
        <div ref={chatInputBoxRef} className="w-full flex justify-center" style={{ padding: "0 0 24px 0" }}>
          <div
            className="w-full"
            style={{
              maxWidth: 900,
              background: "#F5F5F5",
              borderRadius: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              padding: "32px 40px 24px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch"
            }}
          >
            {/* 책갈피/보기설정 버튼 줄 (위로 이동, 크기 축소, 좌측 정렬) */}
            <div className="flex items-center mb-3" style={{ paddingLeft: 0, paddingRight: 0, justifyContent: 'flex-start', gap: 24, marginTop: -8 }}>
              {/* 책갈피 버튼 (왼쪽) */}
              <button
                className="flex flex-col items-center justify-center"
                style={{ color: "#868D96", minWidth: 48 }}
                onClick={handleBookmarkClick}
              >
                <img
                  src="/novel/chat/bookmark.svg"
                  alt="bookmark"
                  width={22}
                  height={22}
                />
                <span className="mt-1" style={{
                  fontFamily: 'NanumSquare Neo, Malgun Gothic, Apple SD Gothic Neo, sans-serif',
                  fontSize: 12
                }}>책갈피</span>
              </button>
              {/* 보기 설정 버튼 (왼쪽 두번째) */}
              <button
                className="flex flex-col items-center justify-center"
                style={{ color: "#868D96", minWidth: 48 }}
                onClick={() => setIsViewSettings(true)}
              >
                <img
                  src="/novel/chat/text-edit.svg"
                  alt="text-edit"
                  width={22}
                  height={22}
                />
                <span className="mt-1" style={{
                  fontFamily: 'NanumSquare Neo, Malgun Gothic, Apple SD Gothic Neo, sans-serif',
                  fontSize: 12
                }}>보기 설정</span>
              </button>
            </div>
            {/* 구분선 */}
            <hr style={{ border: 0, borderTop: '1px solid #E2E1DC', margin: '0 0 20px 0' }} />
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/novel/chat/astroid.svg"
                alt="astroid"
                width={26}
                height={26}
                onClick={handleAsteriskClick}
                style={{ cursor: "pointer", marginRight: 16 }}
              />
              <textarea
                ref={textareaRef}
                onChange={handleTextAreaChange}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="대화를 입력하여 소설을 작성하세요."
                className="flex-1 bg-[#F5F5F5] rounded-full p-0 resize-none leading-relaxed focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-[#868D96]"
                style={{
                  color: "#232325",
                  fontSize: 15,
                  fontFamily: "NanumSquare Neo, Malgun Gothic, Apple SD Gothic Neo, sans-serif",
                  resize: "none",
                  overflow: "hidden",
                  maxHeight: 48,
                  minWidth: 0
                }}
                disabled={isMessageSending}
              ></textarea>
              <div className="flex ml-4 flex-shrink-0" style={{ gap: 10 }}>
                <Button
                  variant={"link"}
                  className="text-primary p-0 flex items-center justify-center [&_svg]:size-5 min-w-[24px]"
                  onClick={undoStory}
                  disabled={isMessageSending}
                >
                  <UndoIcon />
                </Button>
                <Button
                  variant={"link"}
                  className={`text-primary ${isMessageSending ? "opacity-50" : "cursor-pointer"} p-0 flex items-center justify-center [&_svg]:size-5 min-w-[24px]`}
                  disabled={isMessageSending}
                  onClick={() => handleNovelProcess(true)}
                >
                  <AutoChat viewBox="0 0 24 24" />
                </Button>
                <Button
                  variant={"link"}
                  onClick={() => handleNovelProcess(false)}
                  aria-disabled={isMessageSending}
                  className={`text-primary ${isMessageSending ? "opacity-50" : "cursor-pointer"} p-0 flex items-center [&_svg]:size-5 min-w-[24px]`}
                >
                  <PaperPlane />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
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
          panelStyle={
            !isMobile && chatInputBoxRef.current
              ? {
                  position: 'fixed',
                  left: '50%',
                  bottom: chatInputBoxRef.current.offsetHeight + 24,
                  transform: 'translateX(-50%)',
                  width: 600,
                  background: '#fff',
                  color: '#232325',
                  borderRadius: 16,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  border: '1px solid #DBDBDB',
                  zIndex: 100,
                  padding: '24px 0 16px 0',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                }
              : {}
          }
        />
      )}
      {isBookmarkModal && <BookmarkModal />}
    </div>
  );
}
