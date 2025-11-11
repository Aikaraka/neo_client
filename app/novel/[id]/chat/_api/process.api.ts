import { Session } from "@supabase/supabase-js"

// 런타임에서 안전한 기본 API URL 계산 (클라이언트/서버 모두 지원)
const RUNTIME_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : "http://localhost:8000");

export async function processNovel(
  session: Session,
  novelId: string,
  text: string,
  shouldGenerateImage: boolean,
): Promise<Response> {
  if (!session) throw new Error("세션이 없습니다.");

  try {
    
    if (!session.access_token) {
      throw new Error("세션 토큰이 없습니다. 다시 로그인해주세요.");
    }
    
    // neo_server의 /process-novel에 직접 요청
    const response = await fetch(`${RUNTIME_API_URL}/process-novel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        user_id: session.user.id,
        novel_id: novelId,
        input: text,
        should_generate_image: shouldGenerateImage,
      }),
    });

    // 에러 상태 코드 처리
    if (response.status === 402) {
      const errorData = await response.json();
      throw new Error(`TOKEN_INSUFFICIENT: ${errorData.error || "조각이 부족합니다."}`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "알 수 없는 오류" }));
      throw new Error(`API 오류 (${response.status}): ${errorData.error}`);
    }

    // 응답 본문이 없을 경우의 예외 처리
    if (!response.body) {
      throw new Error("ReadableStream not supported.");
    }
    
    return response;

  } catch (error) {
    // 이미 처리된 TOKEN_INSUFFICIENT 에러는 그대로 다시 던집니다.
    if (error instanceof Error && error.message.startsWith("TOKEN_INSUFFICIENT")) {
      throw error;
    }
    
    // 기타 모든 에러는 그대로 다시 던집니다.
    throw error;
  }
}
