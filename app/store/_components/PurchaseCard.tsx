"use client"

import { usePayment } from "@/hooks/use-payment"
import { useUser } from "@/utils/supabase/authProvider"
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { cn } from "@/lib/utils"

type PurchaseCardProps = {
  tokens: number
  price: number
  bonus?: number
  originalTokens?: number
}

export default function PurchaseCard({
  tokens,
  price,
  bonus,
  originalTokens,
}: PurchaseCardProps) {
  const user = useUser()
  const { requestPayment } = usePayment()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const formatNumber = (num: number) => num.toLocaleString()

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "결제를 진행하려면 먼저 로그인해주세요.",
        variant: "destructive",
      })
      return
    }
    if (isProcessing) return
    setIsProcessing(true)

    const orderName = originalTokens
      ? `${formatNumber(originalTokens)}개${bonus ? ` (+${bonus}%)` : ""} 조각`
      : `${formatNumber(tokens)}개 조각`

    const result = await requestPayment({
      storeId: "store-9352e30f-52b7-42c5-8d98-052d88aeb3b5",
      channelKey: "channel-key-210bd239-bbd0-4948-a7f6-5544b7ec7c3c",
      paymentId: `payment-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`, // KG이니시스 OID 길이 제한 대응
      orderName,
      totalAmount: price,
      customer: {
        fullName: user.user_metadata?.nickname || user.email || "고객",  // KG이니시스는 fullName 필드 사용
        phoneNumber: user.phone || user.user_metadata?.phone || "010-0000-0000", // 필수
        email: user.email || "customer@example.com", // 필수
      },
    })

    if (result.success) {
      toast({
        title: "결제 성공",
        description: result.message,
        className: "bg-green-500 text-white",
      })
      await queryClient.invalidateQueries({ queryKey: ["token"] })
    } else {
      toast({
        title: "결제 실패",
        description: result.message,
        variant: "destructive",
      })
    }
    setIsProcessing(false)
  }

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between rounded-lg bg-gray-800 p-6 w-full h-48 cursor-pointer hover:bg-gray-700 transition-colors duration-200",
        isProcessing && "opacity-50 cursor-not-allowed",
      )}
      onClick={handlePayment}
    >
      {bonus && (
        <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
          {bonus}% 보너스
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Image
          src="/header/diamond.svg"
          alt="token icon"
          height={24}
          width={24}
        />
        <span className="text-xl font-bold text-white">
          {originalTokens ? (
            <>
              <span className="line-through text-gray-500 mr-2">
                {formatNumber(originalTokens)}
              </span>
              <span>{formatNumber(tokens)}</span>
            </>
          ) : (
            formatNumber(tokens)
          )}
        </span>
      </div>
      <div className="text-right">
        <span className="text-2xl font-bold text-white">
          {formatNumber(price)}원
        </span>
      </div>
    </div>
  )
} 