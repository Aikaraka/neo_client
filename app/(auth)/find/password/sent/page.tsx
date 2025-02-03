"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { redirect } from "next/navigation";

export default function EmailSent() {
  return (
    <div className="w-full h-screen">
      <div className="w-full h-full flex flex-col justify-center items-center text-center gap-5 px-8">
        <Send className="text-primary" size={50} />
        <h1 className="text-2xl font-bold">
          회원님의 이메일로 <br />
          인증 메일을 보냈습니다.
        </h1>
        <p>메일로 인증하고 비밀번호를 재설정 해주세요.</p>
        <Button
          className="w-full p-6 text-lg"
          onClick={() => redirect("/login")}
        >
          확인
        </Button>
      </div>
    </div>
  );
}
