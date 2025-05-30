"use server";

import { createClient } from "@/utils/supabase/server";

export async function getReaminingGenerations() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!userError || !user) throw new Error("회원 정보를 찾을 수 없습니다");

  const { data } = await supabase
    .from("user_ai_token")
    .select("remaining_tokens")
    .eq("user_id", user.id)
    .single();

  return data?.remaining_tokens ?? 0;
}
