import { loginFormSchemaType } from "@/app/(auth)/login/schema";
import { signInWithEmail } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

export const handleEmailLogin = async ({
  email,
  password,
  supabase,
}: loginFormSchemaType & { supabase: SupabaseClient }) => {
  // 1. 먼저 이메일로 사용자 확인
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (userError && userError.code !== "PGRST116") {
    throw new Error("로그인 정보가 일치하지 않습니다.");
  }

  //소셜 로그인 사용자인지 확인
  if (userData?.auth_provider) {
    if (userData.auth_provider !== "email") {
      throw new Error(
        `이 이메일은 ${userData.auth_provider} 로그인을 사용합니다. ${userData.auth_provider} 로그인 버튼을 이용해주세요.`
      );
    }
  }

  // 3. 이메일/비밀번호로 로그인 시도
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
