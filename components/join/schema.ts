import { z } from "zod";

const genderType = {
  남성: "male",
  여성: "female",
  해당없음: "other",
} as const;

export const joinFormSchema = z.object({
  nickname: z
    .string()
    .min(2, { message: "닉네임은 2글자 이상이어야 합니다." })
    .regex(/^[가-힣a-zA-Z0-9]{2,10}$/, {
      message: "닉네임은 영어, 숫자, 한국어로 10글자 이내여야 합니다.",
    }),
  gender: z.enum(Object.keys(genderType) as [keyof typeof genderType]),
  birth: z.string().regex(/^\d{8}$/, {
    message: "생년월일을 모두 입력해 주세요",
  }),
});

export type JoinFormType = z.infer<typeof joinFormSchema>;
export type JoinFormFieldName = keyof JoinFormType;
