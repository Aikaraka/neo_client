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

export async function claimDailyFreeTokens() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new AuthError("로그인 정보를 찾을 수 없습니다.");

  // 먼저 사용자의 현재 토큰 정보와 마지막 무료 토큰 수령일 확인
  const { data: tokenData, error: tokenError } = await supabase
    .from("user_ai_token")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // 토큰 데이터가 없으면 새로 생성
  if (tokenError && tokenError.code === "PGRST116") {
    const { data: newTokenData, error: insertError } = await supabase
      .from("user_ai_token")
      .insert({
        user_id: user.id,
        remaining_tokens: 5,
        last_reset_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) throw new Error("토큰 생성에 실패했습니다.");
    return { success: true, message: "무료 토큰 5개가 지급되었습니다!", newTokens: 5 };
  }

  if (tokenError) throw new Error("토큰 정보를 조회할 수 없습니다.");

  // 오늘 날짜 확인 (한국 시간 기준)
  const today = new Date();
  const todayKST = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const todayDateString = todayKST.toISOString().split('T')[0];

  // 마지막 무료 토큰 수령일 확인
  if (tokenData.last_reset_date) {
    const lastResetDate = new Date(tokenData.last_reset_date);
    const lastResetKST = new Date(lastResetDate.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const lastResetDateString = lastResetKST.toISOString().split('T')[0];
    
    // 이미 오늘 무료 토큰을 받았는지 확인
    if (lastResetDateString === todayDateString) {
      return { success: false, message: "오늘은 이미 무료 토큰을 받으셨습니다. 내일 다시 시도해주세요!" };
    }
  }

  // 무료 토큰 지급
  const newTokenBalance = (tokenData.remaining_tokens || 0) + 5;
  const { error: updateError } = await supabase
    .from("user_ai_token")
    .update({
      remaining_tokens: newTokenBalance,
      last_reset_date: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (updateError) throw new Error("무료 토큰 지급에 실패했습니다.");

  return { success: true, message: "무료 토큰 5개가 지급되었습니다!", newTokens: newTokenBalance };
}
