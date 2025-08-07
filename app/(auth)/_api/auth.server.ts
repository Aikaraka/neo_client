"use server";

import { createClient } from "@/utils/supabase/server";

export const signout = async () => {
  const supabase = await createClient();
  return supabase.auth.signOut();
};

export const resetPassword = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);

  if (error) throw new Error("이메일에 해당하는 계정을 찾을 수 없습니다.");

  const userName = data[0].name;

  if (name !== userName) throw new Error("정보가 일치하지 않습니다.");

  // 동적으로 현재 도메인 사용 (localhost 또는 vercel 배포 도메인)
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  
  // 끝의 슬래시 제거하여 이중 슬래시 방지
  baseUrl = baseUrl.replace(/\/$/, '');
    
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback/update-password`,
  });
};

export const changePassword = async ({ password }: { password: string }) => {
  const supabase = await createClient();
  
  // 비밀번호 업데이트 시도
  const { error } = await supabase.auth.updateUser({ password: password });
  
  if (error) {
    // Supabase가 "이전 비번과 같다"는 에러를 보내주는지 확인
    if (error.message.includes("New password should be different from the old password")) {
      throw new Error("새 비밀번호는 이전 비밀번호와 달라야 합니다.");
    }
    // 그 외 다른 에러
    throw new Error(`비밀번호 변경에 실패했습니다: ${error.message}`);
  }
  
  return { success: true };
};

export const findEmail = async ({
  name,
  birth,
}: {
  name: string;
  birth: string;
}): Promise<string> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("name", name)
    .eq("birthdate", birth);
  if (!data?.length || error) {
    throw new Error("정보와 해당하는 이메일이 없습니다.");
  }

  return data[0].email;
};
