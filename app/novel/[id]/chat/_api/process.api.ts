import { novelAIServer } from "@/app/novel/_api";
import { Session } from "@supabase/supabase-js";

// 데이터가 직렬화 가능한지 확인하고 안전한 값으로 변환하는 함수
function ensureSerializable(data: any): any {
  // 이미 기본 타입이면 그대로 반환
  if (data === null || data === undefined || 
      typeof data === 'string' || 
      typeof data === 'number' || 
      typeof data === 'boolean') {
    return data;
  }
  
  // 객체인 경우 깊은 복사를 통해 안전한 객체로 변환
  try {
    // JSON 문자열화 후 다시 파싱하여 순수 객체로 변환
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("직렬화 불가능한 데이터:", data);
    // 직렬화할 수 없는 경우 빈 객체 반환
    return {};
  }
}

export function processNovel(
  session: Session | null,
  novelId: string,
  prompt: string
) {
  const safePrompt = ensureSerializable(prompt);
  const safeUserId = session?.user?.id ? String(session.user.id) : null;
  const safeNovelId = String(novelId);
  
  return novelAIServer.post("/process-input", {
    user_id: safeUserId,
    novel_id: safeNovelId,
    text: safePrompt,
  });
}
