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
import { resetPassword } from "@/utils/supabase/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const findPasswordSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소가 아닙니다." }),
  name: z.string().nonempty(),
});
type findPasswordSchemaType = z.infer<typeof findPasswordSchema>;

export default function Page() {
  const form = useForm<findPasswordSchemaType>({
    resolver: zodResolver(findPasswordSchema),
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
    <div className="w-full h-screen flex justify-center px-8 flex-col gap-10">
      <PrevPageButton />
      <h1 className="text-xl font-bold">
        네오 가입 정보 입력 후<br />
        비밀번호를 재설정하세요.
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutate(values))}
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  <span className="text-sm font-medium">이름</span>
                </FormLabel>
                <FormControl>
                  <TextInputWithIcon
                    placeholder="이름"
                    className="p-6 bg-gray-100 rounded-lg"
                    IconComponent={<User />}
                    {...field}
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
                <FormLabel className="flex justify-between">
                  <span className="text-sm font-medium">이메일 주소</span>
                </FormLabel>
                <FormControl>
                  <TextInputWithIcon
                    placeholder="가입 이메일 주소"
                    className="p-6 bg-gray-100 rounded-lg"
                    IconComponent={<Mail />}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="p-6 mt-3" disabled={isPending}>
            {isPending ? "메일 전송중..." : "비밀번호 초기화 메일 보내기"}
          </Button>
        </form>
      </Form>
      <Modal open={open} switch={switchModal}>
        {errorMessage}
      </Modal>
    </div>
  );
}
