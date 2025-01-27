import { z } from "zod";

const genderType = {
  남성: "male",
  여성: "female",
  "해당 없음": "other",
} as const;
export const signupFormSchema = z.object({
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
  name: z
    .string()
    .regex(/^[가-힣]{2,6}$/, { message: "이름을 제대로 입력해주세요." }),
  nickname: z
    .string()
    .min(2, { message: "닉네임은 2글자 이상이어야 합니다." })
    .regex(/^[가-힣a-zA-Z]{2,10}$/, {
      message: "닉네임은 영어 또는 한국어로 10글자 이내여야 합니다.",
    }),
  gender: z.enum(Object.keys(genderType) as [keyof typeof genderType]),
  birth: z
    .string()
    .regex(/^\d{6}$/, {
      message: "생년월일 6자리를 입력해 주세요",
    })
    .refine((value) => {
      const year = parseInt(value.slice(0, 2), 10);
      const month = parseInt(value.slice(2, 4), 10);

      return month >= 1 && month <= 12;
    }),
});
