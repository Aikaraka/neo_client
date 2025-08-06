import PrevPageButton from "@/components/ui/PrevPageButton";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-y-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">계정을 잃어버리셨나요?</h1>
          <p className="mt-2 text-muted-foreground">
            찾으려는 항목을 선택해주세요.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href={"/find/email"}
            className="flex flex-col items-center justify-center gap-2 p-6 border rounded-lg bg-white dark:bg-slate-800 hover:bg-accent hover:text-accent-foreground"
          >
            <Mail className="w-8 h-8 text-primary" />
            <span className="font-semibold">이메일 찾기</span>
          </Link>
          <Link
            href={"/find/password"}
            className="flex flex-col items-center justify-center gap-2 p-6 border rounded-lg bg-white dark:bg-slate-800 hover:bg-accent hover:text-accent-foreground"
          >
            <Lock className="w-8 h-8 text-primary" />
            <span className="font-semibold">비밀번호 찾기</span>
          </Link>
        </div>
        <div className="mt-2">
          <Button
            variant="ghost-muted"
            className="w-full text-muted-foreground"
            asChild
          >
            <Link href="/login" className="gap-1">
              <PrevPageButton />
              로그인으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
