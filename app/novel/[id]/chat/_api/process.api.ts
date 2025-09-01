import { novelAIServer } from "@/app/novel/_api"
import { Session } from "@supabase/supabase-js"

export async function processNovel(
  session: Session,
  novelId: string,
  text: string,
  shouldGenerateImage: boolean,
): Promise<Response> {
  if (!session) throw new Error("세션이 없습니다.");

  try {
    const response = await novelAIServer.post(
      "/process-novel",
      {
        user_id: session.user.id,
        novel_id: novelId,
        input: text,
        should_generate_image: shouldGenerateImage,
      },
      {
        headers: { Authorization: `Bearer ${session.access_token}` },
      },
    );

    // 응답 본문이 없을 경우의 예외 처리
    if (!response.body) {
      throw new Error("ReadableStream not supported.");
    }
    return response;

  } catch (error) {
    // API 클라이언트에서 던진 에러를 여기서 잡습니다.
    // 에러 객체에 response가 있고, 그 status가 402인 경우를 확인합니다.
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 402) {
      // 에러 응답에서 JSON 데이터를 파싱합니다.
      const errorData = await (error.response as Response).json();
      // 토큰 부족을 식별할 수 있는 특정 메시지와 함께 새로운 에러를 던집니다.
      throw new Error(`TOKEN_INSUFFICIENT: ${errorData.error || "토큰이 부족합니다."}`);
    }
    
    // 402 에러가 아닌 다른 모든 에러는 그대로 다시 던집니다.
    throw error;
  }
}
