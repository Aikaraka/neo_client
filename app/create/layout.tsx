import Navbar from "@/components/layout/navbar";
import { MainContent } from "@/components/ui/content";
import { PageProvider } from "@/components/ui/pageContext";
import { Toaster } from "@/components/ui/toaster";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Toaster>
      <main className="w-full h-full pb-20 md:pb-0 flex flex-col md:bg-input justify-center items-center">
        <MainContent className="relative">
          <PageProvider maxPage={1}>
            {children}
          </PageProvider>
        </MainContent>
        <Navbar />
      </main>
    </Toaster>
  );
}
