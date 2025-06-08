"use client";

import { handleEmailLogin } from "@/app/(auth)/login/login.api";
import {
  loginFormSchema,
  loginFormSchemaType,
} from "@/app/(auth)/login/schema";
import useModal from "@/hooks/use-modal";
import { useAuth } from "@/utils/supabase/authProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function useLogin() {
  const { supabase } = useAuth();
  const router = useRouter();
  const {
    open: openErrorModal,
    switchModal,
    setMessage: setErrorMessage,
    message: errorMessage,
  } = useModal();

  const form = useForm<loginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: handleEmailLogin,
    onSuccess: () => router.push("/"),
    onError: (error) => {
      if (error instanceof Error) {
        if (error.message === "Email not confirmed") {
          setErrorMessage(
            "이메일 인증이 되지 않았어요! 이메일 인증 이후 로그인 해주세요!"
          );
        } else {
          setErrorMessage(error.message);
        }
        switchModal();
      } else {
        setErrorMessage(
          "서버 상의 이유로 실패하였습니다.\n 잠시 후 다시 시도해 주세요."
        );
        switchModal();
      }
    },
  });

  function submit(values: loginFormSchemaType) {
    const { email, password } = values;
    mutate({ email, password, supabase });
  }
  return {
    form,
    submit,
    openErrorModal,
    switchModal,
    setErrorMessage,
    isPending,
    errorMessage,
  };
}
