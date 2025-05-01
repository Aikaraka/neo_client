"use client";

import { StoryProvider } from "@/app/novel/[id]/chat/_components/storyProvider";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toaster";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full  h-screen bg-white mx-auto relative">
      <Toaster>
        <StoryProvider>{children}</StoryProvider>
      </Toaster>
      <Navbar />
    </div>
  );
}
