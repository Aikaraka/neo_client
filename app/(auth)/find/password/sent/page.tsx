"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmailSent() {
  const router = useRouter();
  
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm mx-auto flex flex-col justify-center items-center text-center gap-5 px-4">
        <Send className="text-primary" size={50} />
        <h1 className="text-2xl font-bold">
          회원님의 이메일로 <br />
          인증 메일을 보냈습니다.
        </h1>
        <p>메일로 인증하고 비밀번호를 재설정 해주세요.</p>
        <Button
          className="w-full hover:bg-neo-purple/80"
          onClick={() => router.push("/login")}
        >
          확인
        </Button>
      </div>
    </main>
  );
}
