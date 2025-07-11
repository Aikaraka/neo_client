"use client"

import { Button } from "@/components/ui/button"

export default function FreeTokenButton() {
  const handleFreeToken = () => {
    // TODO: Implement free token logic
    alert("무료 토큰이 지급되었습니다! (구현 예정)")
  }

  return (
    <Button
      onClick={handleFreeToken}
      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-6 text-lg rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
    >
      매일 첫 로그인 시 무료 토큰 5개 받기
    </Button>
  )
} 