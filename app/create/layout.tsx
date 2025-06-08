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
      <div className="flex w-full h-screen justify-center items-center bg-input">
        <MainContent className="relative">
          <PageProvider maxPage={1}>
            {children}
          </PageProvider>
        </MainContent>
      </div>
      <Navbar />
    </Toaster>
  );
}
