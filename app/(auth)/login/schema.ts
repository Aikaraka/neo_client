import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소가 아닙니다." }),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      {
        message:
          "비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.",
      }
    ),
});

export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
