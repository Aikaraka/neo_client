"use client";

import { SignupFormFieldName } from "@/app/(auth)/signup/schema";
import SignupFormField from "@/app/(auth)/signup/signupFormField";
import { Button } from "@/components/ui/button";
import { useValidation } from "@/components/ui/form";
import { usePageContext } from "@/components/ui/pageContext";
import { ChevronRight } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function AccountForm() {
  const { register, trigger } = useFormContext();
  const { nextPage } = usePageContext();
  const canProceed = useValidation<SignupFormFieldName>(
    "email",
    "password",
    "passwordConfirm"
    // "name"
  );

  return (
    <div className="w-full h-screen grid  relative">
      <div className="text-2xl font-bold items-center self-center px-8">
        <h1>
          가입을 위한
          <br />
          계정 정보를 입력해주세요.
        </h1>
      </div>
      <div className="flex w-full flex-col gap-5 px-8">
        <SignupFormField name="email" />
        <SignupFormField
          {...register("password", {
            onChange: () => trigger("passwordConfirm"),
          })}
        />
        <SignupFormField name="passwordConfirm" />
      </div>
      <div className="absolute w-full px-8 bottom-20">
        <Button
          className={`text-lg p-7 w-full self-center bottom-20  
          }`}
          variant={canProceed ? "default" : "secondary"}
          disabled={!canProceed}
          onClick={nextPage}
        >
          이메일 인증하기
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
