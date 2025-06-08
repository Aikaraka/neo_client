"use client";

import {
  SignupFormFieldName,
  SignupFormType,
} from "@/app/(auth)/signup/schema";
import SignupFormField from "@/app/(auth)/signup/signupFormField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage, useValidation } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";

import useModal from "@/hooks/use-modal";
import { ChevronRight } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function UserInfoForm({ isPending }: { isPending: boolean }) {
  const { watch, setValue, register, trigger } =
    useFormContext<SignupFormType>();
  const { open, switchModal } = useModal();

  const canProceed =
    useValidation<SignupFormFieldName>(
      "email",
      "password",
      "passwordConfirm"
    );

  return (
    <div className="w-full h-full px-8 py-10 grid relative">
      <div className="text-2xl font-bold items-center self-center">
        <h1>
          네오에 오신걸
          <br />
          환영합니다!
        </h1>
      </div>
      <div className="flex flex-col w-full gap-5 itmes-center">
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
          className={`text-lg p-7 rounded-xl w-full self-center bottom-20  ${
            canProceed
              ? "hover:bg-primary opacity-100"
              : "opacity-50 cursor-not-allowed"
          }`}
          type="submit"
          variant={"default"}
          disabled={!canProceed || isPending}
        >
          {isPending ? "인증중..." : "이메일 인증하기"}
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
