import { LibraryNovel } from "@/types/library";
import { createClient } from "@/utils/supabase/client"; // 클라이언트 측 Supabase 클라이언트 가져오기

// 환경 변수에서 API URL 가져오기
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchLibrary = async (): Promise<LibraryNovel[]> => {
  const supabase = createClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error("세션 가져오기 오류 또는 세션 없음:", sessionError);
    throw new Error("로그인이 필요합니다.");
  }

  // API_URL이 설정되지 않았으면 에러 발생
  if (!API_URL) {
    throw new Error("API 서버 주소가 설정되지 않았습니다. NEXT_PUBLIC_API_URL 환경 변수를 확인하세요.");
  }

  const response = await fetch(`${API_URL}/api/library`, { // 환경 변수 사용
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // 에러 응답 파싱 시도
    console.error("보관함 데이터 가져오기 실패:", response.status, errorData);
    throw new Error(errorData.detail || "보관함 데이터를 가져오는 데 실패했습니다.");
  }

  const data: LibraryNovel[] = await response.json();
  return data;
}; 