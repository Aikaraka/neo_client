import PrevPageButton from "@/components/ui/PrevPageButton";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full h-screen flex justify-center flex-col px-8 gap-5">
      <PrevPageButton />
      <h1 className="text-2xl">계정을 잃어버리셨나요?</h1>
      <div className="w-full flex gap-5 h-1/4">
        <Link
          href={"/find/email"}
          className="w-full h-full flex flex-col justify-center items-center text-lg gap-3 border-2 border-primary rounded-xl hover:bg-buttonHover"
        >
          <Mail size={40} className="text-primary" />
          이메일 찾기
        </Link>
        <Link
          href={"/find/password"}
          className="w-full h-full flex flex-col justify-center items-center text-lg gap-3 border-2 border-primary rounded-xl hover:bg-buttonHover"
        >
          <Lock size={40} className="text-primary" />
          비밀번호 찾기
        </Link>
      </div>
    </div>
  );
}
