import { createClient } from "@/utils/supabase/client";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const supabase = createClient();
  const session = await supabase.auth.getSession();

  if (!session?.data?.session) throw new Error("로그인이 필요합니다.");

  const accessToken = session.data.session.access_token;

  let response = await fetch(`${API_URL}${input}`, {
    ...init,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (response.status === 401) {
    console.warn("⚠️ 401 Unauthorized - Refreshing token...");

    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) throw new Error("세션 갱신 실패");

    console.log("✅ 토큰 갱신 성공, 재시도");

    return fetch(`${API_URL}${input}`, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${data.session.access_token}`,
      },
      credentials: "include",
    });
  }
  return response;
}
