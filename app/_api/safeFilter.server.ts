"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 사용자의 성인 인증 상태와 보호필터 설정을 가져옵니다
 */
export async function getUserSafeFilterStatus() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    // 비로그인 사용자는 항상 보호필터 ON
    return { isAuthenticated: false, isAdult: false, safeFilterEnabled: true };
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("is_adult, safe_filter_enabled")
    .eq("id", user.id)
    .single();

  if (error || !userData) {
    console.error("Failed to fetch user safe filter status:", error);
    return { isAuthenticated: true, isAdult: false, safeFilterEnabled: true };
  }

  return {
    isAuthenticated: true,
    isAdult: userData.is_adult ?? false,
    safeFilterEnabled: userData.safe_filter_enabled ?? true,
  };
}

/**
 * 보호필터 상태를 토글합니다
 * @returns 성공 여부와 새로운 상태
 */
export async function toggleSafeFilter() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    throw new Error("로그인이 필요합니다.");
  }

  // 현재 상태 확인
  const { data: currentData, error: fetchError } = await supabase
    .from("users")
    .select("is_adult, safe_filter_enabled")
    .eq("id", user.id)
    .single();

  if (fetchError || !currentData) {
    throw new Error("사용자 정보를 가져올 수 없습니다.");
  }

  // 성인 인증이 안 되어 있으면 보호필터를 끌 수 없음
  const currentSafeFilter = currentData.safe_filter_enabled ?? true;
  const wantsToDisable = currentSafeFilter === true; // 현재 ON이고 OFF로 바꾸려는 경우
  
  if (!currentData.is_adult && wantsToDisable) {
    return {
      success: false,
      requiresVerification: true,
      safeFilterEnabled: true, // 항상 ON 상태 유지
    };
  }

  // 성인 인증이 없으면 무조건 보호필터 ON
  const newStatus = currentData.is_adult ? !currentSafeFilter : true;
  const { error: updateError } = await supabase
    .from("users")
    .update({ safe_filter_enabled: newStatus })
    .eq("id", user.id);

  if (updateError) {
    throw new Error("보호필터 상태 업데이트에 실패했습니다.");
  }

  // 페이지 리프레시를 위한 revalidate
  revalidatePath("/");
  
  return {
    success: true,
    requiresVerification: false,
    safeFilterEnabled: newStatus,
  };
}

/**
 * 성인 인증 완료 후 처리
 * @param impUid PortOne 인증 ID
 */
export async function completeAgeVerification(impUid: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    throw new Error("로그인이 필요합니다.");
  }

  // TODO: PortOne API를 통해 실제 인증 결과 검증
  // 여기서는 실제 PortOne API 호출 로직이 필요합니다
  
  // 트랜잭션으로 처리
  const { error: updateError } = await supabase
    .from("users")
    .update({ 
      is_adult: true,
      safe_filter_enabled: false // 성인 인증 후 보호필터 자동 해제
    })
    .eq("id", user.id);

  if (updateError) {
    throw new Error("성인 인증 정보 업데이트에 실패했습니다.");
  }

  // 인증 로그 저장
  const { error: logError } = await supabase
    .from("age_verifications")
    .insert({
      user_id: user.id,
      verification_method: "portone",
      imp_uid: impUid,
    });

  if (logError) {
    console.error("Failed to log age verification:", logError);
  }

  revalidatePath("/");
  
  return { success: true };
}

// 생년월일 기반 성인 확인 함수는 사용하지 않음
// 오직 본인인증을 통해서만 성인 인증 가능 