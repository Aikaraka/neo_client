import { APIBuilder } from "@/api/apiBuilder";
import { createClient } from "@/utils/supabase/server";

// 서버 액션/라우트 핸들러 환경에서의 안전한 기본값
const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const novelAiServerForServer = new APIBuilder(SERVER_API_URL)
  .withCredentials(true)
  .headers({
    "Content-type": "application/json",
  })
  .build();

novelAiServerForServer.use.response = async (response, requestFunction) => {
  if (response.status === 401) {
    const supabase = await createClient();

    console.warn("401 Unauthorized - Refreshing token...");

    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error || !data.session) {
        console.error("세션 갱신 실패:", error);
        throw new Error("세션 갱신 실패");
      }

      const newAccessToken = data.session.access_token;
      novelAiServerForServer.headers = {
        ...novelAiServerForServer.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      return requestFunction();
    } catch (refreshError) {
      console.error("조각 갱신 중 오류:", refreshError);
      throw new Error("인증 조각 갱신에 실패했습니다.");
    }
  }
  return response;
};

novelAiServerForServer.use.request = async (options) => {
  try {
    const supabase = await createClient();
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
