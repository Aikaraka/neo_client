"use client";

import { useSettingForm } from "@/app/(auth)/auth/setting/hooks";
import SettingForm from "@/app/(auth)/auth/setting/settingForm";
import { Form } from "@/components/ui/form";
import { Toaster } from "@/components/ui/toaster";

export default function ProfileSetting() {
  const { form, submit, isPending } = useSettingForm();

  return (
    <div className="w-full h-screen relative grid">
      <div className="self-center text-2xl px-8 font-bold">
        <h1>
          네오와 여정을 떠나기 위한
          <br />
          마지막 단계입니다.
        </h1>
      </div>
      <Toaster>
        <Form {...form}>
          <form
            className="w-full h-full"
            onSubmit={form.handleSubmit((values) => submit(values))}
          >
            <SettingForm isPending={isPending} />
          </form>
        </Form>
      </Toaster>
    </div>
  );
}
