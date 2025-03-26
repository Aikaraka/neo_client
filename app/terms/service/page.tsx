import { TermsOfServiceAgreement } from "@/components/agreements";
import Header from "@/components/ui/header";

export default function ServeiceTerm() {
  return (
    <main className="w-full h-screen relative pb-16 ">
      <Header title="서비스 이용 약관" prevPageButton />
      <div className="w-full h-full overflow-y-auto p-6">
        <TermsOfServiceAgreement />
      </div>
    </main>
  );
}
