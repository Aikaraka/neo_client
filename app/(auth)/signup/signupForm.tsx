"use client";

import EmailSent from "@/app/(auth)/signup/emailSent";
import { useSignupForm } from "@/app/(auth)/signup/hooks";
import UserInfoForm from "@/app/(auth)/signup/userInfoForm";
import { Form } from "@/components/ui/form";
import { usePageContext } from "@/components/ui/pageContext";

export default function SignupForm() {
  const { currPage } = usePageContext();
  const { form, submit, isPending } = useSignupForm();

  const handleSubmit = (e: React.FormEvent) => {
    // EmailSent 페이지에서는 submit 방지
    if (currPage === 1) {
      e.preventDefault();
      return;
    }
    // 첫 페이지에서만 정상적으로 submit
    form.handleSubmit((values) => submit(values))(e);
  };

  return (
    <div className="w-full h-full flex">
      <Form {...form}>
        <form
          className="w-full h-full"
          onSubmit={handleSubmit}
        >
          {currPage === 0 && <UserInfoForm isPending={isPending} />}
          {currPage === 1 && <EmailSent />}
        </form>
      </Form>
    </div>
  );
}
