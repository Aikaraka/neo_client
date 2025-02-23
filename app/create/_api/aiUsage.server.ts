"use server";

import { createClient } from "@/utils/supabase/server";

export async function getReaminingGenerations() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!userError || !user) throw new Error("회원 정보를 찾을 수 없습니다");

  const { data, error } = await supabase
    .from("user_ai_usage")
    .select("remaining_generations")
    .eq("user_id", user.id)
    .single();

  return data?.remaining_generations ?? 0;
}
