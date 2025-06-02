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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback/update-password`,
  });
};

export const changePassword = async ({ password }: { password: string }) => {
  const supabase = await createClient();
  return await supabase.auth.updateUser({ password: password });
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
