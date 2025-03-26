import { PrivacyPolicyAgreement } from "@/components/agreements";
import Header from "@/components/ui/header";

export default function PrivacyTerm() {
  return (
    <main className="w-full h-screen relative pb-16 ">
      <Header title="개인정보 처리 방침" prevPageButton />
      <div className="w-full h-full overflow-y-auto p-6">
        <PrivacyPolicyAgreement />
      </div>
    </main>
  );
}
