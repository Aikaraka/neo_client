"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TextInputWithIcon } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import useModal from "@/hooks/use-modal";
import { changePassword } from "@/utils/supabase/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordResetSchema = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        {
          message:
            "비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.",
        }
      ),
    passwordConfirm: z.string().nonempty({
      message: "비밀번호 확인을 입력해주세요.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });
type findPasswordSchemaType = z.infer<typeof passwordResetSchema>;

export default function Page() {
  const form = useForm<findPasswordSchemaType>({
    resolver: zodResolver(passwordResetSchema),
    mode: "onChange",
  });
  const router = useRouter();
  const {
    message: errorMessage,
    open,
    setMessage: setErrorMessage,
    switchModal,
  } = useModal();
  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => router.push("/"),
    onError: (error) => {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        switchModal();
      } else {
        setErrorMessage(
          "서버 상의 이유로 실패하였습니다.\n 잠시 후 다시 시도해 주세요."
        );
        switchModal();
      }
    },
  });

  return (
    <div className="w-full h-screen flex justify-center px-8 flex-col gap-10">
      <h1 className="text-xl font-bold">
        비밀번호를 재설정합니다.
        <br />
        새롭게 사용할 비밀번호를 생성해주세요.
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutate(values))}
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  <span className="text-sm font-medium">비밀번호</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <TextInputWithIcon
                      placeholder="비밀번호"
                      className="p-6 bg-gray-100 rounded-lg"
                      IconComponent={<Lock />}
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  <span className="text-sm font-medium">비밀번호 확인</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <TextInputWithIcon
                      placeholder="비밀번호 확인"
                      className="p-6 bg-gray-100 rounded-lg"
                      IconComponent={<Lock />}
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="p-6 mt-3" disabled={isPending}>
            {isPending ? "변경중..." : "비밀번호 변경"}
          </Button>
        </form>
      </Form>
      <Modal open={open} switch={switchModal}>
        {errorMessage}
      </Modal>
    </div>
  );
}
