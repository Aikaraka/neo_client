import { APIBuilder } from "@/api/apiBuilder";
import { createClient } from "@/utils/supabase/client";

// Supabase Edge Function URL (ocdthvsbuvikwyrjogcd는 사용자의 project ref입니다)
const STREAMING_PROXY_URL = `https://ocdthvsbuvikwyrjogcd.supabase.co/functions/v1/streaming-proxy`;

// eslint-disable-next-line no-console
console.log("🔧 Streaming Proxy URL 설정:", STREAMING_PROXY_URL);

export const streamingProxyClient = new APIBuilder(STREAMING_PROXY_URL)
  .headers({
    "Content-type": "application/json",
  })
  .build();

// 요청 인터셉터: 모든 요청에 Supabase 인증 토큰을 자동으로 주입합니다.
streamingProxyClient.use.request = async (options) => {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error("세션이 없습니다.");
  }

  const accessToken = session.access_token;
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  return options;
};

// 응답 인터셉터: 토큰 만료(401) 시 자동으로 토큰을 갱신하고 요청을 재시도합니다.
streamingProxyClient.use.response = async (response, requestFunction) => {
  if (response.status === 401) {
    const supabase = createClient();

    console.warn("401 Unauthorized - Refreshing token for streaming client...");

    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) throw new Error("세션 갱신 실패");

    // 재시도 시에는 새 토큰이 자동으로 주입되므로 헤더를 직접 수정할 필요가 없습니다.
    console.log("토큰 갱신 성공, 스트리밍 요청 재시도");

    return requestFunction();
  }
  return response;
};
