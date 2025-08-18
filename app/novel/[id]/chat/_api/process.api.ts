import { novelAIServer } from "@/app/novel/_api";
import { Session } from "@supabase/supabase-js";

export function processNovel(
  session: Session | null,
  novelId: string,
  prompt: string
) {
  if (!session?.user?.id) {
    throw new Error("세션이 유효하지 않습니다. 다시 로그인해주세요.");
  }

  console.log(`[processNovel] API 호출 - user_id: ${session.user.id}, novel_id: ${novelId}`);
  
  return novelAIServer.post("/process-input", {
    user_id: session.user.id,
    novel_id: novelId,
    text: prompt,
  });
}
