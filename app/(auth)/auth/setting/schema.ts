import { z } from "zod";

export const settingFormSchema = z.object({
  name: z.string().regex(/^[가-힣]{2,6}$/, {
    message: "이름을 제대로 입력해주세요.",
  }),
  birth: z
    .string()
    .regex(/^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/, {
      message: "생년월일을 모두 입력해주세요.",
    }),
  nickname: z.string().regex(/^[가-힣a-zA-Z0-9]{1,10}$/, {
    message: "닉네임은 한글, 숫자, 영어를 합쳐 10글자 이내만 가능합니다.",
  }),
  gender: z.enum(["남성", "여성", "알 수 없음"]),
});

export type SettingFormType = z.infer<typeof settingFormSchema>;
export type SettingFormFieldName = keyof SettingFormType;
