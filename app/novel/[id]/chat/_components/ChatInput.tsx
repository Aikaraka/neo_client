import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { Button } from "@/components/ui/button";
import { AutoChat, PaperPlane } from "@/public/novel/chat";
import { FormEventHandler, KeyboardEvent, useRef } from "react";
import Image from "next/image";

// 모드 토글 아이콘 컴포넌트
function UserEditIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9 10C11.2091 10 13 8.20914 13 6C13 3.79086 11.2091 2 9 2C6.79086 2 5 3.79086 5 6C5 8.20914 6.79086 10 9 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 19C2 16.2386 4.23858 14 7 14C7.55 14 8.08 14.07 8.59 14.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18.8823 11.1177L12.9411 17.0589C12.7629 17.2371 12.6738 17.3262 12.5999 17.4265C12.5348 17.5153 12.4785 17.6107 12.4319 17.7114C12.3794 17.8249 12.3427 17.9459 12.2694 18.1879L11.5 20.5L13.8121 19.7306C14.0541 19.6573 14.1751 19.6206 14.2886 19.5681C14.3893 19.5215 14.4847 19.4652 14.5735 19.4001C14.6738 19.3262 14.7629 19.2371 14.9411 19.0589L20.8823 13.1177C21.5892 12.4108 21.5892 11.2569 20.8823 10.55C20.1754 9.84315 19.0215 9.84315 18.3146 10.55L18.8823 11.1177ZM18.8823 11.1177L20.5 12.7354" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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
  const {
    sendNovelProcessMessage,
    isMessageSending,
    isBackgroundStreaming,
    isAutoMode,
    toggleAutoMode,
  } = useStoryContext();
  
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

  // 자동 모드: 큰 "계속 생성해주세요" 버튼
  if (isAutoMode) {
    return (
      <div className="w-full bg-transparent p-2">
        <div className="relative">
          <button
            onClick={() => handleNovelProcess(true)}
            disabled={isInputDisabled}
            className="
              w-full h-[60px]
              rounded-lg
              text-white
              flex items-center justify-center gap-3
              font-semibold text-base
              shadow-lg
              transition-all duration-200
              hover:shadow-xl hover:scale-[1.01]
              active:scale-[0.99]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            style={{
              background: 'linear-gradient(127deg, #df25bd 20.48%, #5626a9 83.91%)',
            }}
          >
            <AutoChat className="w-6 h-6" />
            <span>다음 이야기를 생성합니다</span>
          </button>

          {/* 모드 전환 버튼 (우측 상단) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAutoMode();
            }}
            disabled={isInputDisabled}
            className="
              absolute top-2 right-2
              w-8 h-8
              bg-white/20 hover:bg-white/30
              backdrop-blur-sm
              rounded-full
              flex items-center justify-center
              transition-all duration-200
              text-white
              disabled:opacity-50
            "
            title="개입 모드로 전환"
          >
            <UserEditIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 개입 모드: 기존 UI (모드 토글 버튼 포함)
  return (
    <div className="w-full bg-transparent p-2">
      <div className="flex items-center gap-3 w-full bg-[#F5F5F5] p-2 rounded-lg">
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
          {/* 모드 토글 버튼 (자동 모드로 전환) */}
          <Button
            variant="ghost"
            size="icon"
            className="
              p-0 h-auto w-auto
              text-gray-600
              hover:text-primary hover:bg-purple-50
              transition-all duration-200
              rounded-full
              [&_svg]:w-5 [&_svg]:h-5
            "
            onClick={toggleAutoMode}
            disabled={isInputDisabled}
            title="자동 모드로 전환"
          >
            <AutoChat />
          </Button>

          {/* 전송 버튼 */}
          <Button
            variant={"link"}
            className="p-0 h-auto [&_svg]:size-5"
            onClick={() => handleNovelProcess(false)}
            disabled={isInputDisabled}
          >
            <PaperPlane />
          </Button>
        </div>
      </div>
    </div>
  );
}
