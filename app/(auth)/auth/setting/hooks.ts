"use client";

import { initialProfileSubmit } from "@/app/(auth)/auth/setting/_api/initializeProfile.server";
import { settingFormSchema } from "@/app/(auth)/auth/setting/_schema";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function useSettingForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof settingFormSchema>>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      birth: "20000101",
      gender: "남성",
      name: "",
      nickname: "",
    },
    mode: "onChange",
  });
  const { mutate: submit, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof settingFormSchema>) => onSubmit(values),
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof settingFormSchema>) {
    const { birth, gender, name, nickname, marketingAgreement } = values;
    try {
      await initialProfileSubmit(
        name,
        nickname,
        birth,
        gender,
        marketingAgreement
      );
      router.replace("/");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "오류 안내",
          description: error.message,
        });
      }
      toast({
        title: "오류 안내",
        description: "서버 상의 오류가 발생했습니다.",
      });
    }
  }
  return {
    form,
    submit,
    isPending,
  };
}
