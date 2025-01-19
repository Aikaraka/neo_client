"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page() {
  const loginFormSchema = z.object({
    email: z.string().email({ message: "유효한 이메일 주소가 아닙니다." }),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        {
          message:
            "비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.",
        }
      ),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="h-screen grid px-8">
      <div className="flex flex-col items-center justify-center">
        <Image src="/neo_emblem.svg" alt="logo" width={100} height={100} />
        <span className="text-xl font-bold">NEO</span>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span className="text-sm font-medium">이메일 주소</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      className="p-6 bg-gray-100 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span className="text-sm font-medium">비밀번호</span>
                  </FormLabel>
                  <FormControl>
                    <Input className="p-6 bg-gray-100 rounded-lg" {...field} />
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
              type="submit"
              variant="default"
              className="w-full flex items-center justify-center gap-2 p-6 rounded-lg hover:opacity-90 hover:bg-primary"
            >
              <span className="text-lg font-base">다음</span>
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
      <div className="flex flex-col gap-8">
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            또는 10초만에 로그인 · 회원가입 하기
          </span>
        </div>
        <Button variant="outline" className="w-full p-6 rounded-lg">
          <Image
            src="/auth/google_emblem.svg"
            alt="google"
            width={20}
            height={20}
          />
          <span className="text-base font-light">구글 로그인</span>
        </Button>
      </div>
    </div>
  );
}
