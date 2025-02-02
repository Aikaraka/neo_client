"use client";

import EmailSent from "@/app/(auth)/signup/emailSent";
import { useSignupForm } from "@/app/(auth)/signup/hooks";
import UserInfoForm from "@/app/(auth)/signup/userInfoForm";
import { Form } from "@/components/ui/form";
import { usePageContext } from "@/components/ui/pageContext";

export default function SignupForm() {
  const { currPage } = usePageContext();
  const { form, submit, isPending } = useSignupForm();

  return (
    <div className="w-full h-full flex">
      <Form {...form}>
        <form
          className="w-full h-full"
          onSubmit={form.handleSubmit((values) => submit(values))}
        >
          {currPage === 0 && <UserInfoForm isPending={isPending} />}
          {currPage === 1 && <EmailSent />}
        </form>
      </Form>
    </div>
  );
}
