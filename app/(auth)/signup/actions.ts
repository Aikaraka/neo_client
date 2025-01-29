"use server";
import { SignupFormType } from "@/app/(auth)/signup/schema";
import { createClient } from "@/utils/supabase/server";

export const checkEmailDuplication = async (email: string) => {
  const supabase = await createClient();
  const { count, error: checkError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("email", email);
  if (checkError)
    throw new Error("이메일 중복 체크 과정에서 오류가 발생했습니다.");
  return { count };
};

export const signup = async ({
  email,
  password,
}: Pick<SignupFormType, "email" | "password">) => {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `http://localhost:3000/auth/callback`,
    },
  });
  if (error) throw new Error("유저 정보를 저장하던 중 오류가 발생했습니다.");
  return { authData };
};

export const saveToUserTable = async (userId: string, email: string) => {
  const supabase = await createClient();
  const { error: dbError } = await supabase.from("users").insert({
    id: userId,
    email: email,
    auth_provider: "email",
    created_at: new Date().toISOString(),
  });
  if (dbError) throw new Error("유저 정보를 저장하던 중 오류가 발생했습니다.");
};
