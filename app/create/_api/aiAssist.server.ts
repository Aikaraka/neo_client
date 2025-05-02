"use server";

import { CreateNovelForm } from "../_schema/createNovelSchema";
import { createClient } from "@/utils/supabase/server";
import { Character, Relationship } from "@/types/novel";
import { novelAiServerForServer } from "@/api/serverInstance";

export interface AIAssistRequest {
  formData: CreateNovelForm;
  targetField: "plot" | "characters" | "relationships" | "background.start";
  characterIndex?: number; // 캐릭터 수정 시 사용
  relationshipIndex?: number; // 관계 생성 시 두 번째 캐릭터 인덱스
  backgroundType?: "start" | "location"; // 배경 설정 시 사용
}

interface AIAssistResponse {
  content: string | Character | Relationship;
}

export async function postAIAssist(
  request: AIAssistRequest
): Promise<AIAssistResponse> {
  const supabase = await createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("인증 정보를 찾을 수 없습니다.");
  }
  const req = {
    targetField:
      request.targetField === "background.start"
        ? "background"
        : request.targetField,
    formData: request.formData,
  };

  const response = (
    await novelAiServerForServer.post("/input-pumping", req, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
  ).json();

  return response;
}
