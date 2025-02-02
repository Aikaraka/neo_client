import { signupFormSchema } from "@/app/(auth)/signup/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TextInputWithIcon } from "@/components/ui/input";
import { Calendar, Lock, Mail, User } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

type SignupFormType = z.infer<typeof signupFormSchema>;

const fieldType = {
  name: { placeholder: "이름", icon: <User /> },
  birth: { placeholder: "생년월일 6자리", icon: <Calendar /> },
  email: { placeholder: "이메일 주소", icon: <Mail /> },
  password: { placeholder: "비밀번호 입력", icon: <Lock /> },
  passwordConfirm: { placeholder: "비밀번호 확인", icon: <Lock /> },
  nickname: { placeholder: "닉네임", icon: <Mail /> },
  gender: { placeholder: "성별", icon: null },
} as const;

export default function SignupFormField({
  name,
  ...inputProps
}: {
  name: keyof SignupFormType;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const formContext = useFormContext<SignupFormType>();
  if (name === "terms") return null;

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
