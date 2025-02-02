import { LoginForm } from "@/app/(auth)/login/loginForm";
import SocialLoginButton from "@/components/ui/socialLoginButton";
import Image from "next/image";

export default function Page() {
  return (
    <div className="h-screen grid px-8 relative">
      <div className="flex flex-col items-center justify-center">
        <Image src="/neo_emblem.svg" alt="logo" width={100} height={100} />
        <span className="text-xl font-bold">NEO</span>
      </div>
      <LoginForm />
      <div className="flex flex-col gap-8">
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            또는 10초만에 로그인 · 회원가입 하기
          </span>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <SocialLoginButton type="kakao" />
          <SocialLoginButton type="google" />
        </div>
      </div>
    </div>
  );
}
