"use server";

import { CreateNovelForm } from "../_schema/createNovelSchema";
import { createClient } from "@/utils/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AIAssistRequest {
  formData: Partial<CreateNovelForm>;
  targetField: "plot" | "characters" | "relationships" | "background";
  characterIndex?: number; // 캐릭터 수정 시 사용
  relationshipIndex?: number; // 관계 생성 시 두 번째 캐릭터 인덱스
  backgroundType?: "start" | "location"; // 배경 설정 시 사용
}

interface AIAssistResponse {
  content: string;
}

export async function getAIAssist(
  request: AIAssistRequest
): Promise<AIAssistResponse> {
  try {
    const supabase = await createClient();
    
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error("인증 정보를 찾을 수 없습니다.");
    }

    console.log("Making request to:", `${API_URL}/input-pumping`);
    console.log("Request headers:", {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token.substring(0, 10)}...`,
    });
    console.log("Request body:", request);

    const response = await fetch(`${API_URL}/input-pumping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`AI 어시스트 요청에 실패했습니다. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("AI assist error:", error);
    throw new Error("AI 어시스트 처리 중 오류가 발생했습니다.");
  }
} 