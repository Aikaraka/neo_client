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

  if (!res.ok) {
    throw new Error("서버와의 오류가 발생했습니다.");
  }

  const data = await res.json();
  return data.title;
}
