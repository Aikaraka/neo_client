import { APIBuilder } from "@/api/apiBuilder";
import { createClient } from "@/utils/supabase/client";

// 런타임에서 안전한 기본 API URL 계산 (클라이언트/서버 모두 지원)
const RUNTIME_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : "http://localhost:8000");

export const novelAIServer = new APIBuilder(RUNTIME_API_URL)
  .withCredentials(true)
  .headers({
    "Content-type": "application/json",
  })
  .build();

novelAIServer.use.response = async (response, requestFunction) => {
  if (response.status === 401) {
    const supabase = createClient();

    console.warn("401 Unauthorized - Refreshing token...");

    try {
      // 먼저 현재 세션 확인
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // 세션이 없거나 refresh token이 없는 경우
      if (sessionError || !sessionData.session) {
        console.info("세션이 없습니다. 사용자 재로그인 필요");
        return response;
      }

      // refreshSession 호출
      const { data, error } = await supabase.auth.refreshSession();
      
      // refresh_token_not_found는 세션 만료로 정상적인 상황
      if (error) {
        if (error.message?.includes("refresh_token_not_found") || error.code === "refresh_token_not_found") {
          console.info("세션이 만료되었습니다. 사용자 재로그인 필요");
          return response;
        }
        // 다른 에러는 실제 에러로 처리
        console.warn("세션 갱신 실패:", error);
        return response;
      }

      if (!data.session) {
        console.info("세션 갱신 후 세션 데이터가 없습니다.");
        return response;
      }

      // 세션 갱신 성공 시 재요청
      const newAccessToken = data.session.access_token;
      novelAIServer.headers = {
        ...novelAIServer.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      return requestFunction();
    } catch (refreshError) {
      // 예상치 못한 에러만 로깅
      console.warn("세션 갱신 중 예상치 못한 오류:", refreshError);
      return response;
    }
  }
  return response;
};

novelAIServer.use.request = async (options) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.error("세션 조회 실패:", error);
      throw new Error("세션이 없습니다.");
    }
    
    const accessToken = data.session.access_token;
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    
    return options;
  } catch (error) {
    console.error("요청 설정 중 오류:", error);
    throw error;
  }
};
