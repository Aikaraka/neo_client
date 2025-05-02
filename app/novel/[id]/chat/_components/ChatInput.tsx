import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { Button } from "@/components/ui/button";
import { AutoChat, PaperPlane } from "@/public/novel/chat";
import { FormEventHandler, KeyboardEvent, useRef } from "react";

export function ChatInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendNovelProcessMessage, isMessageSending } = useStoryContext();

  const handleTextAreaChange: FormEventHandler<HTMLTextAreaElement> = (e) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      textareaRef.current!.value = "";
      sendNovelProcessMessage(
        !textareaRef.current?.value,
        textareaRef.current?.value
      );
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
    <div className="p-4 items-center gap-2">
      <div className="flex items-center gap-2 bg-input rounded-xl px-3">
        <textarea
          ref={textareaRef}
          onChange={handleTextAreaChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="메시지를 입력하세요."
          className="flex-1 bg-input rounded-xl p-2 text-sm resize-none leading-relaxed overflow-auto max-h-10 focus:outline-none focus:ring-0 focus:border-transparent"
          disabled={isMessageSending}
        ></textarea>
        <div className="flex gap-2">
          <Button
            variant={"link"}
            className={`text-primary  ${
              isMessageSending ? "opacity-50" : "cursor-pointer"
            } p-0 flex items-center justify-center [&_svg]:size-5`}
            disabled={isMessageSending}
            onClick={() => handleNovelProcess(true)}
          >
            <AutoChat viewBox="0 0 24 24" />
          </Button>
          <Button
            variant={"link"}
            onClick={() => handleNovelProcess(false)}
            aria-disabled={isMessageSending}
            className={`text-primary  ${
              isMessageSending ? "opacity-50" : "cursor-pointer"
            } p-0 flex items-center [&_svg]:size-5`}
          >
            <PaperPlane />
          </Button>
        </div>
      </div>
    </div>
  );
}
