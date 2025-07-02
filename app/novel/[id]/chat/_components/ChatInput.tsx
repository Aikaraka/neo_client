import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { Button } from "@/components/ui/button";
import { AutoChat, PaperPlane } from "@/public/novel/chat";
import { FormEventHandler, KeyboardEvent, useRef } from "react";
import { UndoIcon } from "lucide-react";

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
  const { sendNovelProcessMessage, isMessageSending, undoStory } = useStoryContext();
  
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
      if(textareaRef.current) textareaRef.current.value = "";
    }
  };

  const handleNovelProcess = (auto: boolean) => {
    if (auto) {
      sendNovelProcessMessage(true);
    } else if (textareaRef.current?.value) {
      sendNovelProcessMessage(false, textareaRef.current?.value);
      textareaRef.current.value = "";
    }
  };

  return (
    <div className="w-full bg-transparent p-2">
      <div className="flex items-center gap-3 w-full bg-[#F5F5F5] rounded-xl p-2">
        <img
          src="/novel/chat/astroid.svg"
          alt="astroid"
          className="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
          onClick={() => handleAsteriskClick(textareaRef.current)}
        />
        <textarea
          ref={textareaRef}
          onChange={handleTextAreaChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="대화를 입력하여 소설을 작성하세요."
          className="flex-1 bg-transparent p-0 resize-none leading-relaxed focus:outline-none placeholder:text-sm"
          style={{ maxHeight: 80 }}
          disabled={isMessageSending}
        />
        <div className="flex ml-2 flex-shrink-0 gap-2">
          <Button variant={"link"} className="p-0 h-auto [&_svg]:size-5" onClick={undoStory} disabled={isMessageSending}><UndoIcon /></Button>
          <Button variant={"link"} className="p-0 h-auto [&_svg]:size-5" onClick={() => handleNovelProcess(true)} disabled={isMessageSending}><AutoChat /></Button>
          <Button variant={"link"} className="p-0 h-auto [&_svg]:size-5" onClick={() => handleNovelProcess(false)} disabled={isMessageSending}><PaperPlane /></Button>
        </div>
      </div>
    </div>
  );
}
