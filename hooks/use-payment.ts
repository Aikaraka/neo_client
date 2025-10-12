"use client"

import { processAndGrantToken } from "@/app/_api/payment.server"
import { PortOne } from "@/types/portone"

declare global {
  interface Window {
    PortOne: PortOne
  }
}

const PORTONE_STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID
const PORTONE_CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY

interface PaymentParams {
  storeId?: string
  channelKey?: string
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

    const resolvedStoreId = storeId ?? PORTONE_STORE_ID
    const resolvedChannelKey = channelKey ?? PORTONE_CHANNEL_KEY

    if (!window.PortOne) {
      return {
        success: false,
        message: "결제 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
      }
    }

    if (!resolvedStoreId || !resolvedChannelKey) {
      console.error("PortOne 결제 설정이 비어 있습니다.", {
        storeId: resolvedStoreId,
        channelKey: resolvedChannelKey,
      })
      return {
        success: false,
        message: "결제 설정이 올바르지 않습니다. 관리자에게 문의해주세요.",
      }
    }

    try {
      // 1. 포트원 결제 모달 호출
      const response = await window.PortOne.requestPayment({
        storeId: resolvedStoreId,
        channelKey: resolvedChannelKey,
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

      // 2. 결제 성공! 백엔드에 검증 및 조각 지급 요청
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