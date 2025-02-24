"use server";

import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";

export async function getUserToken() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new AuthError("로그인 정보를 찾을 수 없습니다.");

  const { data, error: tokenError } = await supabase
    .from("user_ai_token")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (tokenError) throw new Error("토큰을 가져올 수 없습니다.");

  return data.remaining_tokens;
}
