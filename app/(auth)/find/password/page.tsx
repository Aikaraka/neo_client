"use client";
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
import PrevPageButton from "@/components/ui/PrevPageButton";
import useModal from "@/hooks/use-modal";
import { resetPassword } from "@/app/(auth)/_api/auth.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

const findPasswordSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소가 아닙니다." }),
  name: z.string().nonempty(),
});
type findPasswordSchemaType = z.infer<typeof findPasswordSchema>;

export default function Page() {
  const form = useForm<findPasswordSchemaType>({
    resolver: zodResolver(findPasswordSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const router = useRouter();
  const {
    message: errorMessage,
    open,
    setMessage: setErrorMessage,
    switchModal,
  } = useModal();
  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => router.push("/find/password/sent"),
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
    <main className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-y-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">비밀번호 찾기</h1>
          <p className="mt-2 text-muted-foreground">
            비밀번호를 재설정할 계정 정보를 입력하세요.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <TextInputWithIcon
                      placeholder="홍길동"
                      IconComponent={<User />}
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일 주소</FormLabel>
                  <FormControl>
                    <TextInputWithIcon
                      placeholder="가입 시 사용한 이메일"
                      IconComponent={<Mail />}
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-neo text-white hover:bg-neo-purple/80"
              disabled={isPending}
            >
              {isPending ? "메일 전송 중..." : "비밀번호 재설정 메일 보내기"}
            </Button>
          </form>
        </Form>
        <div className="mt-2">
          <Button variant="ghost-muted" className="w-full text-muted-foreground" asChild>
            <Link href="/find" className="gap-1">
              <PrevPageButton />
              이전 페이지로
            </Link>
          </Button>
        </div>
      </div>
      <Modal open={open} switch={switchModal}>
        {errorMessage}
      </Modal>
    </main>
  );
}
