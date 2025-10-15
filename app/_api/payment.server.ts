"use server"

import { createServiceRoleClient } from "@/utils/supabase/server"
import * as Sentry from "@sentry/nextjs"

interface VerificationResult {
  isSuccess: boolean
  message: string
  paymentData?: {
    id: string
    amount: {
      total: number
    }
    status: string
    customer: {
      email: string
    }
  }
}

/**
 * PortOne 서버에 결제 정보를 직접 조회하여 검증하는 함수
 * @param paymentId - 프론트엔드에서 받은 결제 ID
 */
async function verifyPayment(paymentId: string): Promise<VerificationResult> {
  const apiSecret = process.env.PORTONE_V2_API_SECRET
  if (!apiSecret) {
    return { isSuccess: false, message: "서버 설정 오류" }
  }

  const url = `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `PortOne ${apiSecret}`,
      },
    })

    const paymentData = await response.json()

    if (!response.ok) {
      return {
        isSuccess: false,
        message: paymentData.message || "결제 정보 조회에 실패했습니다.",
      }
    }
    return { isSuccess: true, message: "검증 성공", paymentData }
  } catch (error) {
    // Sentry의 전역 에러 핸들러가 처리하도록 에러를 다시 던집니다.
    throw error
  }
}

/**
 * 결제 정보를 최종 처리하고 사용자에게 조각을 지급하는 서버 액션
 * @param paymentId - 결제 ID
 * @param requestedAmount - 사용자가 결제 요청 시 사용한 금액
 */
export async function processAndGrantToken(
  paymentId: string,
  requestedAmount: number,
): Promise<{ success: boolean; message: string }> {
  const verification = await verifyPayment(paymentId)

  if (!verification.isSuccess) {
    return { success: false, message: verification.message }
  }

  const { paymentData } = verification
  const { amount, status, customer } = paymentData!

  // 1. 상태 검증
  if (status !== "PAID") {
    return { success: false, message: `결제가 완료되지 않았습니다. (상태: ${status})` }
  }

  // 2. 금액 검증
  if (amount.total !== requestedAmount) {
    // 실제 결제된 금액과 우리 시스템이 예상한 금액이 다를 경우 (보안상 매우 중요)
    // ⚠️ 결제 위변조 시도 로깅
    Sentry.captureMessage("결제 금액 불일치 감지 - 잠재적 위변조 시도", {
      level: "warning",
      tags: { 
        event_type: "payment_amount_mismatch", 
        context: "payment_verification",
        security_alert: true
      },
      extra: {
        paymentId,
        requestedAmount,
        actualAmount: amount.total,
        customerEmail: customer.email,
        timestamp: new Date().toISOString(),
      }
    });
    return { success: false, message: "결제 금액이 일치하지 않습니다." }
  }

  // 3. 조각 지급 로직
  // 여기서는 금액에 따라 조각을 결정합니다. 실제로는 DB나 다른 곳에서 상품 정보를 가져올 수 있습니다.
  const getTokenByAmount = (total: number): number | null => {
    const products: { [key: number]: number } = {
      3000: 30,
      5000: 50,
      10000: 105, // 100 + 5%
      30000: 330, // 300 + 10%
      50000: 575, // 500 + 15%
    }
    return products[total] || null
  }

  const grantedToken = getTokenByAmount(amount.total)

  if (!grantedToken) {
    return { success: false, message: "해당 금액의 상품을 찾을 수 없습니다." }
  }

  try {
    // 관리자 권한으로 Supabase 클라이언트 생성 (RLS 우회)
    const supabase = await createServiceRoleClient()

    // 1. 이메일로 users 테이블에서 user_id 조회
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", customer.email)
      .single()

    if (userError || !userData) {
      throw new Error("조각을 지급할 사용자를 찾을 수 없습니다.")
    }
    const userId = userData.id

    // 2. user_id로 user_ai_token 테이블에서 현재 조각 잔액 조회
    const { data: tokenData, error: tokenError } = await supabase
      .from("user_ai_token")
      .select("remaining_tokens")
      .eq("user_id", userId)
      .single()

    if (tokenError && tokenError.code !== "PGRST116") { // 'PGRST116'은 row가 없는 경우
      throw new Error("조각 정보를 조회하는 중 오류가 발생했습니다.")
    }
    
    // 3. 조각 잔액 업데이트 또는 새로 생성
    const currentTokens = tokenData?.remaining_tokens || 0
    const newBalance = currentTokens + grantedToken

    const { error: updateError } = await supabase.from("user_ai_token").upsert(
      {
        user_id: userId,
        remaining_tokens: newBalance,
        last_purchase_date: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )

    if (updateError) {
      throw new Error(`데이터베이스 업데이트에 실패했습니다: ${updateError.message}`)
    }

    // 결제 성공 내역을 payment_history 테이블에 기록
    const { error: historyError } = await supabase
      .from("payment_history")
      .insert({
        user_id: userId,
        amount: amount.total,
        tokens_charged: grantedToken,
        provider: "portone", // 실제 사용하는 PG사 이름으로 변경 가능
      });

    if (historyError) {
      // 중요: 결제와 조각 지급은 성공했으므로, 내역 기록 실패가 전체 트랜잭션을 롤백해서는 안 됩니다.
      // 에러를 로깅하고 관리자에게 알림을 보내는 것이 좋습니다.
      console.error("CRITICAL: Payment history recording failed!", {
        userId,
        paymentId,
        error: historyError,
      });
      Sentry.captureException(historyError, {
        tags: { 
          error_type: "payment_history_error", 
          context: "payment_processing",
          critical: true
        },
        extra: { userId, paymentId, amount: amount.total, grantedToken }
      });
    }
    
    // ✅ 결제 성공 로깅
    Sentry.captureMessage("결제 및 토큰 지급 성공", {
      level: "info",
      tags: { 
        event_type: "payment_success", 
        context: "payment_processing" 
      },
      user: {
        id: userId,
        email: customer.email,
      },
      extra: {
        paymentId,
        amount: amount.total,
        tokensGranted: grantedToken,
        previousBalance: currentTokens,
        newBalance,
        timestamp: new Date().toISOString(),
      }
    });
    
    return { success: true, message: "결제가 성공적으로 완료되었으며, 조각이 지급되었습니다." }
  } catch (dbError) {
    // ⚠️ 조각 지급 실패 로깅 (critical)
    Sentry.captureException(dbError instanceof Error ? dbError : new Error(String(dbError)), {
      tags: { 
        error_type: "token_grant_failure", 
        context: "payment_processing",
        critical: true // 결제는 성공했지만 토큰 지급 실패
      },
      extra: {
        paymentId,
        requestedAmount,
        grantedToken,
        customerEmail: paymentData?.customer.email,
        timestamp: new Date().toISOString(),
      }
    });
    
    const errorMessage = dbError instanceof Error ? dbError.message : String(dbError)
    return {
      success: false,
      message: `결제는 완료되었으나 조각 지급에 실패했습니다. 관리자에게 문의해주세요. (사유: ${errorMessage})`,
    }
  }
}

/**
 * 결제를 취소하는 서버 액션
 * @param paymentId - 취소할 결제 ID
 * @param reason - 취소 사유
 */
export async function cancelPayment(
  paymentId: string,
  reason: string = "고객 요청"
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `https://api.portone.io/payments/${paymentId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `PortOne ${process.env.PORTONE_V2_API_SECRET}`,
        },
        body: JSON.stringify({
          reason,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        message: `취소 실패: ${errorData.message || "알 수 없는 오류"}`,
      }
    }

    await response.json() // 응답은 사용하지 않지만 읽어서 버퍼를 비움
    return {
      success: true,
      message: "결제가 성공적으로 취소되었습니다.",
    }
  } catch (error) {
    // Sentry의 전역 에러 핸들러가 처리하도록 에러를 다시 던집니다.
    throw error
  }
} 