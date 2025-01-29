import DatePicker from "@/app/(auth)/auth/setting/datePicker";
import {
  SettingFormFieldName,
  SettingFormType,
} from "@/app/(auth)/auth/setting/schema";
import SettingFormField from "@/app/(auth)/auth/setting/settingFormField";
import { Button } from "@/components/ui/button";
import { useValidation } from "@/components/ui/form";
import * as Radio from "@radix-ui/react-radio-group";
import { Controller, useFormContext } from "react-hook-form";

export default function SettingForm({ isPending }: { isPending: boolean }) {
  const { control } = useFormContext<SettingFormType>();

  const canProceed = useValidation<SettingFormFieldName>(
    "birth",
    "name",
    "nickname"
  );

  return (
    <div className="px-8 flex flex-col gap-5">
      <SettingFormField name="name" />
      <SettingFormField name="nickname" />
      <div className="flex items-center gap-2 px-2 justify-between">
        생년월일
        <DatePicker name="birth" />
      </div>
      <div className="flex justify-between items-center px-2">
        성별
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <Radio.Root
              className="flex gap-2"
              value={value || ""}
              onValueChange={onChange}
            >
              <Radio.Item
                value="남성"
                className="py-2 px-5 border border-muted rounded-lg transition-colors duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              >
                남성
              </Radio.Item>
              <Radio.Item
                value="여성"
                className="py-2 px-5 border border-muted rounded-lg transition-colors duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              >
                여성
              </Radio.Item>
              <Radio.Item
                value="알 수 없음"
                className="py-2 px-5 border border-muted rounded-lg transition-colors duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              >
                알 수 없음
              </Radio.Item>
            </Radio.Root>
          )}
        />
      </div>
      <div className="absolute bottom-20 w-full px-8 left-0">
        <Button
          className="w-full bg-neo text-base p-6 disabled:bg-background"
          disabled={!canProceed || isPending}
        >
          계정 생성 완료
        </Button>
      </div>
    </div>
  );
}
