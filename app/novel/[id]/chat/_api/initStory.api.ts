"use server";

import { novelAIServer } from "@/app/novel/_api";
import { createClient } from "@/utils/supabase/client";

interface StoryItem {
  content: string;
  story_number: number;
}

export interface InitStoryResponse {
  title: string;
  story?: string;
  initial_stories: StoryItem[];
  has_more_stories: boolean;
  oldest_story_number: number;
  background: {
    start: string;
    detailedLocations: string[];
  };
  progress_rate: number;
}

export async function initStory(novelId: string): Promise<InitStoryResponse> {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  console.log(sessionError, session);
  if (sessionError || !session) throw new Error("세션 오류가 발생했습니다.");

  const initialData = await (
    await novelAIServer.post(
      "/init-story",
      {
        user_id: session.user.id,
        novel_id: novelId,
      },
      {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    )
  ).json();

  return initialData;
}
