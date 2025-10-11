"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * PortOne API를 통해 본인인증 결과를 검증합니다
 */
async function verifyPortOnePayment(impUid: string): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.PORTONE_API_KEY;
    const secretKey = process.env.PORTONE_SECRET_KEY;
    
    if (!apiKey || !secretKey) {
      console.error("PortOne API 키 누락:", { apiKey: !!apiKey, secretKey: !!secretKey });
      throw new Error("PortOne API 키가 설정되지 않았습니다.");
    }
    
    // PortOne API 토큰 발급
    const tokenResponse = await fetch("https://api.iamport.kr/users/getToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imp_key: apiKey,
        imp_secret: secretKey,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.code !== 0) {
      console.error("토큰 발급 실패:", tokenData);
      throw new Error("PortOne 토큰 발급 실패");
    }

    const accessToken = tokenData.response.access_token;

    // 본인인증 결과 조회
    const verificationResponse = await fetch(`https://api.iamport.kr/certifications/${impUid}`, {
      method: "GET",
      headers: {
        "Authorization": accessToken,
      },
    });

    const verificationData = await verificationResponse.json();
    
    if (verificationData.code !== 0) {
      console.error("본인인증 결과 조회 실패:", verificationData);
      throw new Error("본인인증 결과 조회 실패");
    }

    const certification = verificationData.response;
    
    // 본인인증 성공 여부 확인 - certified 필드 사용
    if (!certification.certified) {
      console.error("본인인증이 완료되지 않음:", certification);
      return { success: false, error: "본인인증이 완료되지 않았습니다." };
    }

    return { success: true };
  } catch (error) {
    console.error("PortOne API 검증 오류:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: `본인인증 검증 중 오류가 발생했습니다: ${errorMessage}` };
  }
}

/**
 * 사용자의 성인 인증 상태와 보호필터 설정을 가져옵니다
 */
export async function getUserSafeFilterStatus() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    // 비로그인 사용자는 항상 보호필터 ON
    return { isAuthenticated: false, isAdult: false, safeFilterEnabled: true, ageVerificationCompleted: false };
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("is_adult, safe_filter_enabled, age_verification_completed")
    .eq("id", user.id)
    .single();

  if (error || !userData) {
    console.error("Failed to fetch user safe filter status:", error);
    return { isAuthenticated: true, isAdult: false, safeFilterEnabled: true, ageVerificationCompleted: false };
  }

  return {
    isAuthenticated: true,
    isAdult: userData.is_adult ?? false,
    safeFilterEnabled: userData.safe_filter_enabled ?? true,
    ageVerificationCompleted: userData.age_verification_completed ?? false,
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
    .select("is_adult, safe_filter_enabled, age_verification_completed")
    .eq("id", user.id)
    .single();

  if (fetchError || !currentData) {
    throw new Error("사용자 정보를 가져올 수 없습니다.");
  }

  // 현재 보호필터 상태
  const currentSafeFilter = currentData.safe_filter_enabled ?? true;
  const wantsToDisable = currentSafeFilter === true; // 현재 ON이고 OFF로 바꾸려는 경우
  
  // 본인인증을 완료하지 않은 사용자는 보호필터를 끌 수 없음
  if (!currentData.age_verification_completed && wantsToDisable) {
    return {
      success: false,
      requiresVerification: true,
      safeFilterEnabled: true, // 항상 ON 상태 유지
    };
  }

  // 본인인증을 완료한 사용자만 보호필터 토글 가능
  const newStatus = currentData.age_verification_completed ? !currentSafeFilter : true;
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

  // PortOne API를 통해 실제 인증 결과 검증
  const verificationResult = await verifyPortOnePayment(impUid);
  if (!verificationResult.success) {
    throw new Error(verificationResult.error || "본인인증 검증에 실패했습니다.");
  }
  
  // 트랜잭션으로 처리
  const { error: updateError } = await supabase
    .from("users")
    .update({ 
      is_adult: true,
      age_verification_completed: true,
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