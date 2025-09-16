import { MainContent } from "@/components/ui/content";
import { PageProvider } from "@/components/ui/pageContext";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full justify-center bg-background pt-4">
      <MainContent className="relative">
        <PageProvider maxPage={1}>{children}</PageProvider>
      </MainContent>
    </div>
  )
}
