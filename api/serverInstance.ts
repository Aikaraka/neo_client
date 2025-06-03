import { APIBuilder } from "@/api/apiBuilder";
import { createClient } from "@/utils/supabase/server";

// 임시로 localhost 사용 (연결 문제 해결을 위해)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

console.log("🔧 API URL 설정:", API_URL);

export const novelAiServerForServer = new APIBuilder(API_URL)
  .withCredentials(true)
  .headers({
    "Content-type": "application/json",
  })
  .build();

novelAiServerForServer.use.response = async (response, requestFunction) => {
  if (response.status === 401) {
    const supabase = await createClient();

    console.warn("401 Unauthorized - Refreshing token...");

    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) throw new Error("세션 갱신 실패");

    const newAccessToken = data.session.access_token;
    novelAiServerForServer.headers = {
      ...novelAiServerForServer.headers,
      Authorization: `Bearer ${newAccessToken}`,
    };
    console.log("토큰 갱신 성공, 재시도");

    return requestFunction();
  }
  return response;
};

novelAiServerForServer.use.request = async (options) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  console.log("novelAIServer.use.request", data, error);
  if (error || !data.session) {
    throw new Error("세션이 없습니다.");
  }
  const accessToken = data.session.access_token;
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  return options;
};
