"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error("유저 정보를 가져오지 못했습니다.");
  const { data: userData, error: notFoundError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (notFoundError) throw new Error("유저 정보를 찾을 수 없습니다.");
  return userData;
}
