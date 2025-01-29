import { SettingFormType } from "@/app/(auth)/auth/setting/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TextInputWithIcon } from "@/components/ui/input";
import { Calendar, Mail, User } from "lucide-react";
import { useFormContext } from "react-hook-form";

const fieldType = {
  name: { placeholder: "이름", icon: <User /> },
  birth: { placeholder: "생년월일 6자리", icon: <Calendar /> },
  nickname: { placeholder: "닉네임", icon: <Mail /> },
  gender: { placeholder: "성별", icon: null },
} as const;

export default function SettingFormField({
  name,
  ...inputProps
}: {
  name: keyof SettingFormType;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const formContext = useFormContext<SettingFormType>();

  return (
    <FormField
      control={formContext.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div>
              <TextInputWithIcon
                placeholder={fieldType[name].placeholder}
                className="p-6 bg-gray-100 rounded-lg"
                IconComponent={fieldType[name].icon}
                {...field}
                {...inputProps}
              />
              <FormMessage />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
