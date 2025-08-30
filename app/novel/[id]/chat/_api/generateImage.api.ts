import { novelAIServer } from "@/app/novel/_api"
import { Session } from "@supabase/supabase-js"

export async function generateImage(
  session: Session,
  novelId: string,
): Promise<{ success: boolean; image_url: string }> {
  if (!session) throw new Error("세션이 없습니다.")

  const response = await novelAIServer.post(
    "/generate-story-images",
    {
      user_id: session.user.id,
      novel_id: novelId,
    },
    {
      headers: { Authorization: `Bearer ${session.access_token}` },
    },
  )

  const data = await response.json();
  return data;
}
