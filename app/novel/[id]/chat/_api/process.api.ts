import { Session } from "@supabase/supabase-js";

export function processNovel(
  session: Session | null,
  novelId: string,
  prompt: string
) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return fetch(`${API_URL}/process-input`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({
      user_id: session?.user.id,
      novel_id: novelId,
      text: prompt,
    }),
  });
}
