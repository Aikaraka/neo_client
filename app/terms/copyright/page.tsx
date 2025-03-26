import { CopyrightTerm } from "@/components/agreements";
import Header from "@/components/ui/header";

export default function CopyRightTermPage() {
  return (
    <main className="w-full h-screen relative pb-16 ">
      <Header title="저작권 및 지식재산권 관리 정책" prevPageButton />
      <div className="w-full h-full overflow-y-auto p-6">
        <CopyrightTerm />
      </div>
    </main>
  );
}
