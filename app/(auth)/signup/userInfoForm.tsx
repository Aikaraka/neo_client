"use client";

import {
  SignupFormFieldName,
  SignupFormType,
} from "@/app/(auth)/signup/schema";
import SignupFormField from "@/app/(auth)/signup/signupFormField";
import { Button } from "@/components/ui/button";
import { useValidation } from "@/components/ui/form";

import { ChevronRight } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function UserInfoForm({ isPending }: { isPending: boolean }) {
  const { register, trigger } = useFormContext<SignupFormType>();

  const canProceed = useValidation<SignupFormFieldName>(
    "email",
    "password",
    "passwordConfirm"
  );

  return (
    <div className="flex flex-col gap-y-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">
          네오에 오신걸
          <br />
          환영합니다!
        </h1>
      </div>
      
      <div className="flex flex-col gap-4">
        <SignupFormField name="email" />
        <SignupFormField
          {...register("password", {
            onChange: () => trigger("passwordConfirm"),
          })}
        />
        <SignupFormField name="passwordConfirm" />
      </div>
      
      <Button
        className={`w-full bg-neo text-white hover:bg-neo-purple/80 ${
          canProceed
            ? "opacity-100"
            : "opacity-50 cursor-not-allowed"
        }`}
        type="submit"
        variant={"default"}
        disabled={!canProceed || isPending}
      >
        <span>{isPending ? "인증중..." : "이메일 인증하기"}</span>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
