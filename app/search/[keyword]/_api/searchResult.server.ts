"use server";

import { createClient } from "@/utils/supabase/server";

// 정의된 키워드 목록
const DEFINED_KEYWORDS = [
  "로맨스", "로맨스판타지", "학원물", "무협", "이세계", "게임판타지", 
  "회귀", "빙의", "환생", "차원이동", "타임슬립", "서바이벌", 
  "헌터", "게이트", "튜토리얼", "던전", "현대물", "시대물", 
  "궁중물", "서양풍", "동양풍", "SF", "디스토피아", "가상현실", 
  "성좌물", "좀비", "괴수", "마법", "제국", "기사단", "황실", 
  "재벌가", "연예계", "아이돌", "오피스", "셀럽", "직장물", 
  "의사물", "형사물", "법조물", "추리", "스릴러", "복수극", "정략결혼"
];

export async function getSearchResult(keyword: string) {
  const supabase = await createClient();
  const decodedKeyword = decodeURIComponent(keyword);
  
  // 1단계: 정확한 키워드 매칭 (우선순위 최고)
  if (DEFINED_KEYWORDS.includes(decodedKeyword)) {
    const { data: exactMatch } = await supabase
      .from("novels")
      .select("*")
      .contains("mood", [decodedKeyword])
      .filter("settings->isPublic", "eq", true)
      .order("created_at", { ascending: false });
      
    if (exactMatch && exactMatch.length > 0) {
      return exactMatch;
    }
  }
  
  // 2단계: 제목 검색 (키워드가 정의되지 않았거나 결과가 없는 경우)
  const { data: titleMatch, error } = await supabase
    .from("novels")
    .select("*")
    .ilike("title", `%${decodedKeyword}%`)
    .filter("settings->isPublic", "eq", true)
    .order("created_at", { ascending: false });
    
  if (error) throw new Error("검색 결과를 가져오던 중 오류가 발생했습니다.");
  return titleMatch || [];
}
