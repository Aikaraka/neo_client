import { loginFormSchemaType } from "@/app/(auth)/login/schema";
import { signInWithEmail } from "@/utils/supabase/client";

export const handleEmailLogin = async ({
  email,
  password,
}: loginFormSchemaType) => {
  // 이메일/비밀번호로 로그인 시도
  const { data, error } = await signInWithEmail(email, password);

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      throw new Error(`이메일 또는 비밀번호가 올바르지 않습니다.`);
    }
    throw error;
  }

  if (data.user && !data.user.email_confirmed_at) {
    throw new Error(
      "이메일 인증이 되지 않았어요 ! 이메일 인증 이후 로그인 해주세요 !"
    );
  }
};
