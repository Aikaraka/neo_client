"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { claimDailyFreeTokens } from "@/utils/supabase/service/token.server"
import { useUser } from "@/utils/supabase/authProvider"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function FreeTokenButton() {
  const user = useUser()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleFreeToken = async () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "무료 토큰을 받으려면 먼저 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await claimDailyFreeTokens()
      
      if (result.success) {
        toast({
          title: "토큰 지급 완료!",
          description: result.message,
          className: "bg-green-500 text-white",
        })
        // 토큰 정보 갱신
        await queryClient.invalidateQueries({ queryKey: ["token"] })
      } else {
        toast({
          title: "토큰 지급 불가",
          description: result.message,
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "토큰 지급 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleFreeToken}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-6 text-lg rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "처리 중..." : "매일 첫 로그인 시 무료 토큰 5개 받기"}
    </Button>
  )
} 