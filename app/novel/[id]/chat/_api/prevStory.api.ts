"use server";

import { novelAiServerForServer } from "@/api/serverInstance";
import { createClient } from "@/utils/supabase/server";

export async function getPreviousStories(
  novelId: string,
  beforeStoryNumber: number,
  limit: number = 3
): Promise<PreviousStoriesResponse> {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw new Error("세션 오류가 발생했습니다.");
  const response = await novelAiServerForServer.get(
    `/api/novel/${novelId}/previous-stories?before_story_number=${beforeStoryNumber}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    }
  );
  const data = await response.json();
  return data;
}

/**
 * 스토리 타입 정의
 */
export interface StoryItem {
  content: string;
  user_input?: string;
  story_number: number;
  image_url?: string;
}

/**
 * API 응답 타입 정의
 */
export interface PreviousStoriesResponse {
  stories: StoryItem[];
  has_more: boolean;
}
