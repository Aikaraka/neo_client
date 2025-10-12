import { novelAIServer } from "@/app/novel/_api";
import { createClient } from "@/utils/supabase/client";
import * as Sentry from "@sentry/nextjs";

interface StoryItem {
  content: string;
  user_input?: string;
  story_number: number;
  image_url?: string;
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
  protagonist_name?: string;
}

export async function initStory(novelId: string): Promise<InitStoryResponse> {
  try {
    const supabase = createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      const error = new Error("세션 오류가 발생했습니다.");
      Sentry.captureException(error, {
        tags: { type: "session_error" },
        extra: { sessionError, novelId },
      });
      throw error;
    }

    const response = await novelAIServer.post(
      "/init-story",
      {
        user_id: session.user.id,
        novel_id: novelId,
      },
      {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    );

    if (!response.ok) {
      const error = new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
      Sentry.captureException(error, {
        tags: { type: "api_error", status: response.status },
        extra: { 
          novelId, 
          userId: session.user.id,
          url: response.url,
          status: response.status,
          statusText: response.statusText,
        },
      });
      throw error;
    }

    const initialData = await response.json();
    return initialData;
  } catch (error) {
    // 네트워크 에러 (Failed to fetch) 캡처
    if (error instanceof TypeError && error.message.includes("fetch")) {
      Sentry.captureException(error, {
        tags: { type: "network_error" },
        extra: { 
          novelId,
          message: "백엔드 서버 연결 실패",
          apiUrl: process.env.NEXT_PUBLIC_API_URL || "환경 변수 없음",
        },
      });
    }
    throw error;
  }
}
