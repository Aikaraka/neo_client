import Navbar from "@/components/layout/navbar";
import { MainContent } from "@/components/ui/content";
import { PageProvider } from "@/components/ui/pageContext";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";

const heiroOfLight = localFont({
  src: "../fonts/HeirofLightRegular.ttf",
  display: "swap",
});

const bombaram = localFont({
  src: "../fonts/bombaram.ttf",
  display: "swap",
});

export default function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Toaster>
      <main className="w-full h-full pb-20 md:pb-0 flex flex-col md:bg-input justify-center items-center">
        <MainContent className="relative">
          <PageProvider maxPage={2} variants={{ variant: "header" }}>
            {children}
          </PageProvider>
        </MainContent>
        <Navbar />
      </main>
    </Toaster>
  );
}
