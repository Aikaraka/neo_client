import { APIBuilder } from "@/api/apiBuilder";
import { createClient } from "@/utils/supabase/client";

// .env.local 또는 Vercel 환경 변수에 설정된 값을 직접 사용합니다.
// 불안정한 동적 URL 계산 로직을 제거하여 문제를 해결합니다.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 디버깅용 로그
// eslint-disable-next-line no-console
console.log("🔧 API URL 설정:", API_URL);


export const novelAIServer = new APIBuilder(API_URL)
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
