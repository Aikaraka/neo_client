import { APIBuilder } from "@/api/apiBuilder";
import { createClient } from "@/utils/supabase/client";

// 런타임에서 안전한 기본 API URL 계산 (클라이언트/서버 모두 지원)
const RUNTIME_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : "http://localhost:8000");

// 디버깅용 로그 (개발 시에만 유용)
// eslint-disable-next-line no-console
console.log("🔧 API URL 설정 (client):", RUNTIME_API_URL);

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

    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) throw new Error("세션 갱신 실패");

    const newAccessToken = data.session.access_token;
    novelAIServer.headers = {
      ...novelAIServer.headers,
      Authorization: `Bearer ${newAccessToken}`,
    };
    console.log("토큰 갱신 성공, 재시도");

    return requestFunction();
  }
  return response;
};

novelAIServer.use.request = async (options) => {
  const supabase = createClient();
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

novelAIServer.use.response = async (response, requestFunction) => {
  if (response.status === 401) {
    const supabase = createClient();

    console.warn("401 Unauthorized - Refreshing token...");

    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) throw new Error("세션 갱신 실패");

    const newAccessToken = data.session.access_token;
    novelAIServer.headers = {
      ...novelAIServer.headers,
      Authorization: `Bearer ${newAccessToken}`,
    };
    console.log("토큰 갱신 성공, 재시도");

    return requestFunction();
  }
  return response;
};

novelAIServer.use.request = async (options) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
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
