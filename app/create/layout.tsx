import Navbar from "@/components/layout/navbar";
import { PageProvider } from "@/components/ui/pageContext";
import { Toaster } from "@/components/ui/toaster";
import { PencilLine } from "@/public/navbar";

export default function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Toaster>
      <main className="w-full h-svh pb-20  flex flex-col">
        <header className="text-center text-xl p-4 flex items-center justify-center gap-2 font-semibold relative">
          <div className="flex gap-2 items-center">
            <PencilLine />
            <p>나만의 소설 만들기</p>
          </div>
        </header>
        <div className="overflow-auto">
          <PageProvider maxPage={2} variants={{ variant: "header" }}>
            {children}
          </PageProvider>
        </div>
        <Navbar />
      </main>
    </Toaster>
  );
}
