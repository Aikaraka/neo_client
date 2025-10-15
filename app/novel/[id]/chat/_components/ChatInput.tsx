import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { Button } from "@/components/ui/button";
import { AutoChat, PaperPlane } from "@/public/novel/chat";
import { FormEventHandler, KeyboardEvent, useRef } from "react";
import { UndoIcon } from "lucide-react";
import Image from "next/image";

// Helper function to handle asterisk click
const handleAsteriskClick = (textarea: HTMLTextAreaElement | null) => {
  if (textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const newValue = value.slice(0, start) + "**" + value.slice(end);
    textarea.value = newValue;
    textarea.setSelectionRange(start + 1, start + 1);
    textarea.focus();
    // Re-calculate height
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 80) + "px";
  }
};

export function ChatInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendNovelProcessMessage, isMessageSending, undoStory, isBackgroundStreaming } = useStoryContext();
  
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
      if(textareaRef.current) {
        textareaRef.current.value = "";
        // Reset height to initial state
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleNovelProcess = (auto: boolean) => {
    if (auto) {
      sendNovelProcessMessage(true);
    } else if (textareaRef.current?.value) {
      sendNovelProcessMessage(false, textareaRef.current?.value);
      textareaRef.current.value = "";
      // Reset height to initial state
      textareaRef.current.style.height = "auto";
    }
  };

  const isInputDisabled = isMessageSending || isBackgroundStreaming;

  return (
    <div className="w-full bg-transparent p-2">
      <div className="flex items-center gap-3 w-full bg-[#F5F5F5] p-2">
        <Image
          src="/novel/chat/astroid.svg"
          alt="astroid"
          width={24}
          height={24}
          className="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
          onClick={() => handleAsteriskClick(textareaRef.current)}
        />
        <textarea
          ref={textareaRef}
          onChange={handleTextAreaChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={isBackgroundStreaming ? "첫 장면을 로딩 중..." : "소설을 작성해주세요."}
          className="flex-1 bg-transparent p-0 resize-none leading-relaxed focus:outline-none placeholder:text-sm"
          style={{ maxHeight: 80, paddingTop: '4px' }}
          disabled={isInputDisabled}
        />
        <div className="flex ml-2 flex-shrink-0 gap-2">
          <Button variant={"link"} className="p-0 h-auto [&_svg]:size-5" onClick={undoStory} disabled={isInputDisabled}><UndoIcon /></Button>
          <Button variant={"link"} className="p-0 h-auto [&_svg]:size-5" onClick={() => handleNovelProcess(true)} disabled={isInputDisabled}><AutoChat /></Button>
          <Button variant={"link"} className="p-0 h-auto [&_svg]:size-5" onClick={() => handleNovelProcess(false)} disabled={isInputDisabled}><PaperPlane /></Button>
        </div>
      </div>
    </div>
  );
}
