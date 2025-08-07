"use client";
import DatePicker from "@/app/(auth)/auth/setting/_components/datePicker";
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
import { findEmail } from "@/app/(auth)/_api/auth.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

const findEmailSchema = z.object({
  name: z.string().nonempty(),
  birth: z
    .string()
    .regex(/^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/, {
      message: "생년월일을 모두 입력해주세요.",
    }),
});
type findEmailSchemaType = z.infer<typeof findEmailSchema>;

export default function Page() {
  const form = useForm<findEmailSchemaType>({
    resolver: zodResolver(findEmailSchema),
    defaultValues: {
      name: "",
      birth: "20000101",
    },
  });
  const router = useRouter();
  const {
    message: errorMessage,
    open: errorModal,
    setMessage: setErrorMessage,
    switchModal: switchErrorModal,
  } = useModal();
  const {
    message: emailInform,
    open: emailInformModal,
    setMessage: setEmailInformMessage,
    switchModal: switchEmailInfromModal,
  } = useModal();

  const { mutate, isPending } = useMutation({
    mutationFn: findEmail,
    onSuccess: (email) => {
      setEmailInformMessage(`회원님의 이메일은 ${email}입니다.`);
      switchEmailInfromModal();
    },
    onError: (error) => {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        switchErrorModal();
      } else {
        setErrorMessage(
          "서버 상의 이유로 실패하였습니다.\n 잠시 후 다시 시도해 주세요."
        );
        switchErrorModal();
      }
    },
  });

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-y-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">이메일 찾기</h1>
          <p className="mt-2 text-muted-foreground">
            가입 시 입력한 정보를 입력해주세요.
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
              name="birth"
              render={() => (
                <FormItem>
                  <FormLabel>생년월일</FormLabel>
                  <FormControl>
                    <DatePicker name="birth" />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full hover:bg-neo-purple/80" disabled={isPending}>
              {isPending ? "찾는 중..." : "이메일 찾기"}
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

      <Modal open={errorModal} switch={switchErrorModal}>
        {errorMessage}
      </Modal>
      <Modal
        open={emailInformModal}
        switch={switchEmailInfromModal}
        onConfirm={() => router.push("/login")}
        confirmText="로그인"
      >
        {emailInform}
      </Modal>
    </main>
  );
}
