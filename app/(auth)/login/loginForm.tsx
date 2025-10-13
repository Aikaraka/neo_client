"use client";

import { useLogin } from "@/app/(auth)/login/hooks";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { TextInputWithIcon } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ChevronRight, Lock, Mail } from "lucide-react";
import Link from "next/link";

const loginFormFields = {
  email: { placeholder: "이메일 주소", icon: <Mail /> },
  password: { placeholder: "비밀번호 입력", icon: <Lock /> },
} as const;

export function LoginForm() {
  const { form, submit, openErrorModal, switchModal, errorMessage, isPending } =
    useLogin();
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => submit(values))}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span className="text-sm font-medium">이메일 주소</span>
                  </FormLabel>
                  <FormControl>
                    <TextInputWithIcon
                      placeholder="example@gmail.com"
                      className="p-6 bg-gray-100 rounded-lg"
                      IconComponent={loginFormFields["email"].icon}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span className="text-sm font-medium">비밀번호</span>
                  </FormLabel>
                  <FormControl>
                    <TextInputWithIcon
                      type="password"
                      className="p-6 bg-gray-100 rounded-lg"
                      IconComponent={loginFormFields["password"].icon}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Button
              disabled={isPending}
              type="submit"
              variant="default"
              className="w-full flex items-center justify-center gap-2 p-6 rounded-lg bg-neo text-white hover:bg-neo-purple/80"
            >
              <span className="text-lg font-base">
                {isPending ? "로그인 중.." : "로그인"}
              </span>
              <ChevronRight className="w-6 h-6" />
            </Button>
            <div className="flex items-center justify-center gap-x-2 text-sm">
              <Button
                variant="link"
                className="p-0 text-muted-foreground"
                asChild
              >
                <Link href="/find">계정/비밀번호 찾기</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <Modal open={openErrorModal} switch={switchModal} type="inform">
        {errorMessage}
      </Modal>
    </>
  );
}
