"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { ProgressRate } from "@/app/novel/[id]/chat/_components/ProgressRate";
import { StoryContent } from "@/app/novel/[id]/chat/_components/StoryContent";
import { ChatInput } from "@/app/novel/[id]/chat/_components/ChatInput";
import NotFound from "@/app/[...404]/page";

export default function ChatPage() {
  const { initError } = useStoryContext();

  if (initError) return <NotFound />;
  return (
    <div className="flex flex-col w-full h-full bg-white">
      <ProgressRate />
      <StoryContent />
      <ChatInput />
    </div>
  );
}
