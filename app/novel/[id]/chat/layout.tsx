import { StoryProvider } from "@/app/novel/[id]/chat/_components/storyProvider";
import { Toaster } from "@/components/ui/toaster";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
      <Toaster>
        <StoryProvider>{children}</StoryProvider>
      </Toaster>
    </div>
  );
}
