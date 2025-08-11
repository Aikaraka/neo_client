"use client";

import { SignupFormType } from "@/app/(auth)/signup/schema";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

export default function EmailSent() {
  const { getValues, reset } = useFormContext<SignupFormType>();
  const { email } = getValues();
  const router = useRouter();

  useEffect(() => {
    // 이메일이 없으면 홈으로 리다이렉트 (직접 URL 접근 방지)
    if (!email) {
      router.push("/");
      return;
    }
    
    // 뒤로가기 방지를 위해 히스토리 조작
    window.history.pushState(null, "", window.location.pathname);
    
    const handlePopState = () => {
      // 뒤로가기 시 홈으로 이동
      router.push("/");
    };
    
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router, email]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center gap-5 px-8">
      <Send className="text-primary" size={50} />
      <h1 className="text-3xl font-bold">
        이메일 인증 메일을 <br />
        보냈습니다.
      </h1>
      <p>
        <span className="text-primary">{email}</span> <br />
        메일로 인증 후 가입을 완료해주세요 !
      </p>
      <Button
        type="button"
        variant="default"
        className="w-full p-6 text-lg transition-opacity hover:opacity-80 hover:bg-primary"
        onClick={() => {
          reset();
          router.push("/");
        }}
      >
        확인
      </Button>
    </div>
  );
}
