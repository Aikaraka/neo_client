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

  const { data: duplicateData } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (duplicateData) throw new Error("이미 존재하는 이메일입니다.");

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `http://localhost:3000/auth/callback`,
    },
  });
  if (error) {
    throw new Error("유저 정보를 저장하던 중 오류가 발생했습니다.");
  }
  return { authData };
};
