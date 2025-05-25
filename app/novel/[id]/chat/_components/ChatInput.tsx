import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { Button } from "@/components/ui/button";
import { AutoChat, PaperPlane } from "@/public/novel/chat";
import { FormEventHandler, KeyboardEvent, useRef, useState } from "react";
import { UndoIcon } from "lucide-react";
import { ViewSettingsPanel } from "./ViewSettingsPanel";

export function ChatInput({ onColorChange, isDark, selectedColor, fontSize, lineHeight, paragraphSpacing, paragraphWidth, onFontSizeChange, onLineHeightChange, onParagraphSpacingChange, onParagraphWidthChange }: {
  onColorChange?: (color: string) => void,
  isDark: boolean,
  selectedColor: string,
  fontSize: number,
  lineHeight: number,
  paragraphSpacing: number,
  paragraphWidth: number,
  onFontSizeChange: (size: number) => void,
  onLineHeightChange: (lh: number) => void,
  onParagraphSpacingChange: (ps: number) => void,
  onParagraphWidthChange: (width: number) => void,
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendNovelProcessMessage, isMessageSending, undoStory } = useStoryContext();
  const [isViewSettings, setIsViewSettings] = useState(false);

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

  return (
    <div className="w-full" style={{ background: "#F5F5F5", position: "relative", padding: "0 0 16px 0" }}>
      {/* 기존 astroid, 입력창, 버튼 등 전체 UI 항상 렌더링 */}
      {/* 구분선 (astroid 위) */}
      <div style={{ height: 1, background: "#DEDEDE", margin: "0 0 8px 0" }} />
      {/* 첫 줄: astroid 아이콘 */}
      <div className="flex items-center" style={{ height: 32, paddingLeft: 16, paddingTop: 0 }}>
        <img src="/novel/chat/astroid.svg" alt="astroid" width={24} height={24} />
      </div>
      {/* 두 번째 줄: 입력창 + ai/전송/undo 버튼 */}
      <div className="flex items-center w-full" style={{ justifyContent: "center", marginBottom: 8 }}>
        <div className="flex items-center bg-[#EDEDEE] rounded-full px-4 py-2 w-[90%]" style={{ minHeight: 40 }}>
          <textarea
            ref={textareaRef}
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="대화를 입력하여 소설을 작성하세요."
            className="flex-1 bg-[#EDEDEE] rounded-full p-0 text-sm resize-none leading-relaxed max-h-10 focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-[#868D96]"
            style={{ color: "#232325", fontSize: 15, fontFamily: 'NanumSquare Neo OTF', resize: "none", overflow: "hidden" }}
            disabled={isMessageSending}
          ></textarea>
          {/* 버튼 그룹: Undo, AI, Send */}
          <div className="flex gap-2 ml-2">
            <Button
              variant={"link"}
              className="text-primary p-0 flex items-center justify-center [&_svg]:size-5"
              onClick={undoStory}
              disabled={isMessageSending}
            >
              <UndoIcon />
            </Button>
            <Button
              variant={"link"}
              className={`text-primary ${isMessageSending ? "opacity-50" : "cursor-pointer"} p-0 flex items-center justify-center [&_svg]:size-5`}
              disabled={isMessageSending}
              onClick={() => handleNovelProcess(true)}
            >
              <AutoChat viewBox="0 0 24 24" />
            </Button>
            <Button
              variant={"link"}
              onClick={() => handleNovelProcess(false)}
              aria-disabled={isMessageSending}
              className={`text-primary ${isMessageSending ? "opacity-50" : "cursor-pointer"} p-0 flex items-center [&_svg]:size-5`}
            >
              <PaperPlane />
            </Button>
          </div>
        </div>
      </div>
      {/* 세 번째 줄: 책갈피(왼쪽), 보기 설정(가운데), 빈칸(오른쪽) */}
      <div className="flex items-center justify-between mt-2 px-6">
        {/* 책갈피 버튼 (왼쪽) */}
        <button className="flex flex-col items-center justify-center" style={{ color: "#868D96" }}>
          <img src="/novel/chat/bookmark.svg" alt="bookmark" width={24} height={24} />
          <span className="text-xs mt-1" style={{ fontFamily: 'NanumSquare Neo OTF' }}>책갈피</span>
        </button>
        {/* 보기 설정 버튼 (가운데) */}
        <button
          className="flex flex-col items-center justify-center"
          style={{ color: "#868D96" }}
          onClick={() => setIsViewSettings(true)}
        >
          <img src="/novel/chat/text-edit.svg" alt="text-edit" width={24} height={24} />
          <span className="text-xs mt-1" style={{ fontFamily: 'NanumSquare Neo OTF' }}>보기 설정</span>
        </button>
        {/* 빈칸 (오른쪽, 추후 버튼 자리) */}
        <div style={{ width: 40, height: 40 }} />
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
        />
      )}
    </div>
  );
}
