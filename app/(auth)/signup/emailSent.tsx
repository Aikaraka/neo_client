"use client";

import { SignupFormType } from "@/app/(auth)/signup/schema";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { redirect } from "next/navigation";
import { useFormContext } from "react-hook-form";

export default function EmailSent() {
  const { getValues } = useFormContext<SignupFormType>();
  const { email } = getValues();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center gap-5 px-8">
      <Send className="text-primary" size={50} />
      <h1 className="text-3xl font-bold">
        이메일 인증 메일을 <br />
        보냈습니다.
      </h1>
      <p>
        <span className="text-primary">{email}</span>로 보낸 메일로 인증하고
        <br />
        가입을 완료해보세요.
      </p>
      <Button className="w-full p-6 text-lg" onClick={() => redirect("/login")}>
        확인
      </Button>
    </div>
  );
}
