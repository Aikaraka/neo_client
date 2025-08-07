"use client";

import SettingForm from "@/app/(auth)/auth/setting/_components/settingForm";
import { useSettingForm } from "@/app/(auth)/auth/setting/hooks";
import { Form } from "@/components/ui/form";
import { Toaster } from "@/components/ui/toaster";

export default function ProfileSetting() {
  const { form, submit, isPending } = useSettingForm();

  return (
    <main className="w-full max-w-md mx-auto flex flex-col justify-center min-h-screen gap-y-6 px-4 bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          네오와 여정을 떠나기 위한<br />마지막 단계입니다.
        </h1>
      </div>
      <Toaster>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit((values) => submit(values))}
          >
            <SettingForm isPending={isPending} />
          </form>
        </Form>
      </Toaster>
    </main>
  );
}
