import { z } from "zod";

// 만 나이 계산 함수
function calculateAge(birthDate: string): number {
  const year = parseInt(birthDate.slice(0, 4));
  const month = parseInt(birthDate.slice(4, 6));
  const day = parseInt(birthDate.slice(6, 8));
  
  const today = new Date();
  const birth = new Date(year, month - 1, day);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export const settingFormSchema = z.object({
  name: z.string().regex(/^[가-힣]{2,6}$/, {
    message: "이름을 제대로 입력해주세요.",
  }),
  birth: z
    .string()
    .regex(/^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/, {
      message: "생년월일을 모두 입력해주세요.",
    })
    .refine((birthDate) => {
      const age = calculateAge(birthDate);
      return age >= 14;
    }, {
      message: "만 14세 이상만 회원가입이 가능합니다.",
    }),
  nickname: z.string().regex(/^[가-힣a-zA-Z0-9]{1,10}$/, {
    message: "닉네임은 한글, 숫자, 영어를 합쳐 10글자 이내만 가능합니다.",
  }),
  gender: z.enum(["남성", "여성", "알 수 없음"]),
  termsOfServiceAgreement: z.literal<boolean>(true, {
    errorMap: () => ({ message: "서비스 이용 약관은 필수로 동의해야 합니다." }),
  }),
  privacyPolicyAgreement: z.literal<boolean>(true, {
    errorMap: () => ({
      message: "개인정보 처리 약관은 필수로 동의해야 합니다.",
    }),
  }),
  marketingAgreement: z.boolean().optional(),
});

export { calculateAge };

export type SettingFormType = z.infer<typeof settingFormSchema>;
export type SettingFormFieldName = keyof SettingFormType;
