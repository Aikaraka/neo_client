import { novelAIServer } from "@/app/novel/_api";
import { Session } from "@supabase/supabase-js";

export function processNovel(
  session: Session | null,
  novelId: string,
  prompt: string
) {
  return novelAIServer.post("/process-input", {
    user_id: session?.user.id,
    novel_id: novelId,
    text: prompt,
  });
}
