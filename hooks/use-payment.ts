"use client"

import { processAndGrantToken } from "@/app/_api/payment.server"
import { PortOne } from "@/types/portone"

declare global {
  interface Window {
    PortOne: PortOne
  }
}

interface PaymentParams {
  storeId: string
  channelKey: string
  paymentId: string
  orderName: string
  totalAmount: number
  customer: {
    fullName?: string    // KG이니시스는 fullName 필드를 사용
    email?: string
    phoneNumber?: string
  }
}

export function usePayment() {
  const requestPayment = async (params: PaymentParams) => {
    const {
      storeId,
      channelKey,
      paymentId,
      orderName,
      totalAmount,
      customer,
    } = params

    if (!window.PortOne) {
      return {
        success: false,
        message: "결제 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
      }
    }

    try {
      // 1. 포트원 결제 모달 호출
      const response = await window.PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName,
        totalAmount,
        currency: "KRW",
        customer,
        payMethod: "CARD",
        products: [
          {
            id: `token-${totalAmount}`,
            name: orderName,
            amount: totalAmount,
            quantity: 1,
            description: "구매일로부터 1년 이내 사용 가능",
          },
        ],
      })

      if (response.code) {
        // 사용자가 결제를 취소했거나, 모달 내에서 오류 발생
        return { success: false, message: response.message || "결제를 취소했습니다." }
      }

      // 2. 결제 성공! 백엔드에 검증 및 토큰 지급 요청
      const verificationResult = await processAndGrantToken(
        paymentId,
        totalAmount,
      )

      return verificationResult
    } catch (error) {
      console.error("An unexpected error occurred:", error)
      return { success: false, message: "결제 중 예상치 못한 오류가 발생했습니다." }
    }
  }

  return { requestPayment }
} 