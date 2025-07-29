"use server"

import { createClient } from "@/utils/supabase/server"

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
    console.error("PortOne API secret is not configured.")
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
      console.error("PortOne API error:", paymentData)
      return {
        isSuccess: false,
        message: paymentData.message || "결제 정보 조회에 실패했습니다.",
      }
    }
    return { isSuccess: true, message: "검증 성공", paymentData }
  } catch (error) {
    console.error("An unexpected error occurred during verification:", error)
    return { isSuccess: false, message: "결제 검증 중 오류가 발생했습니다." }
  }
}

/**
 * 결제 정보를 최종 처리하고 사용자에게 토큰을 지급하는 서버 액션
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
    // TODO: 결제 위변조 시도에 대한 로깅 및 알림 처리
    return { success: false, message: "결제 금액이 일치하지 않습니다." }
  }

  // 3. 토큰 지급 로직
  // 여기서는 금액에 따라 토큰을 결정합니다. 실제로는 DB나 다른 곳에서 상품 정보를 가져올 수 있습니다.
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
    // 일반 클라이언트 사용 (Service Role Key 불필요)
    const supabase = await createClient()

    // 1. 이메일로 users 테이블에서 user_id 조회
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", customer.email)
      .single()

    if (userError || !userData) {
      throw new Error("토큰을 지급할 사용자를 찾을 수 없습니다.")
    }
    const userId = userData.id

    // 2. user_id로 user_ai_token 테이블에서 현재 토큰 잔액 조회
    const { data: tokenData, error: tokenError } = await supabase
      .from("user_ai_token")
      .select("remaining_tokens")
      .eq("user_id", userId)
      .single()

    if (tokenError && tokenError.code !== "PGRST116") { // 'PGRST116'은 row가 없는 경우
      throw new Error("토큰 정보를 조회하는 중 오류가 발생했습니다.")
    }
    
    // 3. 토큰 잔액 업데이트 또는 새로 생성
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
      throw new Error("데이터베이스 업데이트에 실패했습니다.")
    }

    // TODO: 결제 성공 내역을 별도 테이블에 기록하는 로직 추가
    
    return { success: true, message: "결제가 성공적으로 완료되었으며, 토큰이 지급되었습니다." }
  } catch (dbError) {
    console.error("Database or token grant error:", dbError)
    // TODO: 토큰 지급 실패 시 처리 (예: 재시도 큐, 관리자 알림)
    const errorMessage = dbError instanceof Error ? dbError.message : String(dbError)
    return {
      success: false,
      message: `결제는 완료되었으나 토큰 지급에 실패했습니다. 관리자에게 문의해주세요. (사유: ${errorMessage})`,
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
    console.error("Payment cancellation error:", error)
    return {
      success: false,
      message: "결제 취소 중 오류가 발생했습니다.",
    }
  }
} 