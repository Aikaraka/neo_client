import { APIBuilder } from "@/api/apiBuilder";
import { createClient } from "@/utils/supabase/client";

export const novelAIServer = new APIBuilder(
  process.env.NEXT_PUBLIC_API_URL as string
)
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

novelAIServer.use.request = (options) => {
  return options;
};
