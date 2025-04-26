// neo/neo_client/app/create/_api/coverGeneration.server.ts
'use server'

import { z } from 'zod'
import { createClient } from "@/utils/supabase/server"

const coverGenerationResponseSchema = z.object({
  success: z.boolean(),
  urls: z.array(z.string())
})

export type CoverGenerationResponse = z.infer<typeof coverGenerationResponseSchema>

export async function generateCovers(novelData: any): Promise<CoverGenerationResponse> {
  try {
    console.log("generateCovers 함수 시작")
    
    // Supabase 클라이언트 생성
    const supabase = await createClient()
    console.log("Supabase 클라이언트 생성 완료")
    
    // 사용자 정보 가져오기
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error("세션 에러:", sessionError)
      throw new Error("인증 정보를 찾을 수 없습니다.")
    }
    
    if (!session) {
      console.error("세션이 없음")
      throw new Error("인증 정보를 찾을 수 없습니다.")
    }
    
    console.log("세션 가져오기 완료, 토큰:", session.access_token.substring(0, 10) + "...")
    
    // API URL 설정
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    console.log("API URL:", API_URL)
    
    // API 호출
    console.log("API 호출 시작")
    const response = await fetch(`${API_URL}/api/novel/generate-covers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(novelData)
    })
    console.log("API 응답 상태:", response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error: ${response.status} ${response.statusText}`)
      console.error(`Error details: ${errorText}`)
      throw new Error(`Failed to generate covers: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("API 응답 데이터:", data)
    
    return coverGenerationResponseSchema.parse(data)
  } catch (error) {
    console.error('Error generating covers:', error)
    return {
      success: false,
      urls: []
    }
  }
}