"use server";

import { novelAIServer } from "@/app/novel/_api";
import { createClient } from "@/utils/supabase/server";

/**
 * 스토리 타입 정의
 */
export interface StoryItem {
  content: string;
  story_number: number;
}

export interface PreviousStoriesResponse {
  stories: StoryItem[];
  has_more: boolean;
}

export async function fetchPreviousStories(
  novelId: string,
  beforeStoryNumber: number,
  limit: number = 3
): Promise<PreviousStoriesResponse> {
  const supabase = await createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) throw new Error("세션 오류가 발생했습니다.");
  const response = await novelAIServer.get(
    `/api/novel/${novelId}/previous-stories?before_story_number=${beforeStoryNumber}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${session.access_token}` },
    }
  );

  return response.json();
}
