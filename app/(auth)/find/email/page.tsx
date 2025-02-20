"use client";
import DatePicker from "@/app/(auth)/auth/setting/datePicker";
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
import { findEmail } from "@/utils/supabase/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    <div className="w-full h-screen flex justify-center px-8 flex-col gap-10">
      <PrevPageButton />
      <h1 className="text-xl font-bold">네오 가입 당시 정보를 입력해주세요.</h1>
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
          <div className="flex items-center gap-2 px-2 justify-between">
            생년월일
            <DatePicker name="birth" />
          </div>
          <Button type="submit" className="p-6 mt-3" disabled={isPending}>
            {isPending ? "찾는중.." : "이메일 찾기"}
          </Button>
        </form>
      </Form>
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
    </div>
  );
}
