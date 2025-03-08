/**
 * 이전 스토리를 가져오는 API 함수
 * 
 * @param session 사용자 세션 (인증 토큰 포함)
 * @param novelId 소설 ID
 * @param beforeStoryNumber 이 번호보다 이전의 스토리를 가져옴
 * @param limit 한 번에 가져올 스토리 수 (기본값: 3)
 * @returns 스토리 목록과 더 이전 스토리 존재 여부
 */
export async function fetchPreviousStories(
  session: any,
  novelId: string,
  beforeStoryNumber: number,
  limit: number = 3
): Promise<PreviousStoriesResponse> {
  if (!session?.access_token) {
    throw new Error('인증 토큰이 필요합니다.');
  }

  try {
    // 절대 URL 사용 (환경 변수에서 API URL 가져오기)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const url = `${API_URL}/api/novel/${novelId}/previous-stories?before_story_number=${beforeStoryNumber}&limit=${limit}`;
    console.log("Fetching previous stories from:", url);
    
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'Refresh-Token': session.refresh_token || ''
        },
        credentials: 'same-origin',
      }
    );

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      let errorMessage = '';
      try {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        errorMessage = errorText;
      } catch (e) {
        errorMessage = '응답을 읽는 중 오류가 발생했습니다.';
      }
      throw new Error(`API 오류: ${response.status} - ${errorMessage}`);
    }

    // 응답 내용 로깅
    const responseText = await response.text();
    console.log("Raw response:", responseText);
    
    // 빈 응답 체크
    if (!responseText.trim()) {
      console.error("Empty response received");
      return { stories: [], has_more: false };
    }
    
    // JSON 파싱 시도
    try {
      const data = JSON.parse(responseText);
      console.log("Previous stories response:", data);
      return data;
    } catch (e: any) {
      console.error("JSON parsing error:", e);
      throw new Error(`응답을 JSON으로 파싱할 수 없습니다: ${e.message}`);
    }
  } catch (error) {
    console.error('이전 스토리 가져오기 오류:', error);
    throw error;
  }
}

/**
 * 스토리 타입 정의
 */
export interface StoryItem {
  content: string;
  story_number: number;
}

/**
 * API 응답 타입 정의
 */
export interface PreviousStoriesResponse {
  stories: StoryItem[];
  has_more: boolean;
} 