import { fetchWithAuth } from "@/api/fetchWithAuth.client";
import { Session } from "@supabase/supabase-js";

export function processNovel(
  session: Session | null,
  novelId: string,
  prompt: string
) {
  return fetchWithAuth("/process-input", {
    method: "POST",
    body: JSON.stringify({
      user_id: session?.user.id,
      novel_id: novelId,
      text: prompt,
    }),
  });
}
