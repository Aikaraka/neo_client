import { z } from "zod";

export const signupFormSchema = z
  .object({
    email: z.string().email({ message: "유효한 이메일 주소가 아닙니다." }),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$/,
        {
          message:
            "비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.",
        }
      ),
    passwordConfirm: z.string().nonempty({
      message: "비밀번호 확인을 입력해주세요.",
    }),
    // name: z
    //   .string()
    //   .regex(/^[가-힣]{2,6}$/, { message: "이름을 제대로 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type SignupFormType = z.infer<typeof signupFormSchema>;
export type SignupFormFieldName = keyof SignupFormType;
