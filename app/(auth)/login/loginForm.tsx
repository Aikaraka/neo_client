"use client";

import { useLogin } from "@/app/(auth)/login/hooks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { TextInputWithIcon } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          className="flex flex-col gap-6"
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
                      className="p-6 bg-gray-100 rounded-lg"
                      IconComponent={loginFormFields["password"].icon}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        className="data-[state=checked]:bg-primary border-muted-foreground"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        비밀번호 기억하기
                      </Label>
                    </div>
                    <Button
                      variant="link"
                      className="text-sm text-primary"
                      asChild
                    >
                      <Link href="/forgot-password">
                        계정을 잃어버리셨나요?
                      </Link>
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              disabled={isPending}
              type="submit"
              variant="default"
              className="w-full flex items-center justify-center gap-2 p-6 rounded-lg hover:opacity-90 hover:bg-primary"
            >
              <span className="text-lg font-base">
                {isPending ? "로그인 중.." : "로그인"}
              </span>
              <ChevronRight className="w-6 h-6" />
            </Button>
            <div className="flex justify-center items-center gap-2">
              <span className="text-sm text-muted-foreground">
                아직 회원이 아니신가요?
              </span>
              <Button variant="link" className="text-sm text-primary" asChild>
                <Link href="/signup">회원가입하기</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <Modal open={openErrorModal} switch={switchModal}>
        {errorMessage}
      </Modal>
    </>
  );
}
