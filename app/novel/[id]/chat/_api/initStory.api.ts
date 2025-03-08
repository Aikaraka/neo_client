import { createClient } from "@/utils/supabase/client";

export async function initStory(novelId: string) {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) throw new Error("세션 오류가 발생했습니다.");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // init-story에 user_id와 novel_id 전송
  const res = await fetch(`${API_URL}/init-story`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      "Refresh-Token": session.refresh_token,
    },
    credentials: "include",
    body: JSON.stringify({
      user_id: session.user.id,
      novel_id: novelId,
    }),
  });

  console.log("Response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API error (${res.status}):`, errorText);
    throw new Error(`서버 오류: ${res.status} - ${errorText}`);
  }

  // 응답 내용 로깅
  const responseText = await res.text();
  console.log("Raw response:", responseText);
  
  // 빈 응답 체크
  if (!responseText.trim()) {
    console.error("Empty response received");
    throw new Error("서버에서 빈 응답을 받았습니다.");
  }
  
  // JSON 파싱 시도
  try {
    const data = JSON.parse(responseText);
    console.log("initStory API response:", data);
    return data;
  } catch (e: any) {
    console.error("JSON parsing error:", e);
    throw new Error(`응답을 JSON으로 파싱할 수 없습니다: ${e.message}`);
  }
}
