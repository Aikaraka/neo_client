"use client";

import { StoryProvider } from "@/app/novel/[id]/chat/_components/storyProvider";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ismobile = useIsMobile();
  return (
    <div className="flex flex-col w-full  h-screen bg-white mx-auto relative">
      <Toaster>
        <StoryProvider>{children}</StoryProvider>
      </Toaster>
      <Navbar visible={!ismobile} />
    </div>
  );
}
