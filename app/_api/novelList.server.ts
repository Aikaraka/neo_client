"use server";

import { createClient } from "@/utils/supabase/server";

export async function getRecommendedNovels() {
  const supabase = await createClient();
  
  try {
    // 공개된 소설만 가져오기
    const { data, error } = await supabase
      .from("novels")
      .select("*")
      .filter('settings->isPublic', 'eq', true) // settings 컬럼의 isPublic이 true인 소설만 가져오기
      .order("created_at", { ascending: false }) // 최신 소설 우선
      .limit(8);

    if (error) {
      console.error("추천 소설 정보를 가져오던 중 오류가 발생했습니다:", error);
      throw new Error("소설 정보를 가져오던 중 오류가 발생했습니다.");
    }
    
    // 선택된 소설이 없거나 부족한 경우 공개된 최신 소설 반환
    if (!data || data.length === 0) {
      console.log("선택된 추천 소설이 없습니다. 공개된 최신 소설을 가져옵니다.");
      
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("novels")
        .select("*")
        .filter('settings->isPublic', 'eq', true) // settings 컬럼의 isPublic이 true인 소설만 가져오기
        .order("created_at", { ascending: false })
        .limit(8);
        
      if (fallbackError) {
        console.error("대체 소설 정보를 가져오던 중 오류가 발생했습니다:", fallbackError);
        return [];
      }
      
      return fallbackData || [];
    }
    
    return data;
  } catch (e) {
    console.error("추천 소설 정보를 가져오는 중 오류 발생:", e);
    return [];
  }
}

export async function getTopNovels() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("novels")
      .select("*")
      .filter('settings->isPublic', 'eq', true) // settings 컬럼의 isPublic이 true인 소설만 가져오기
      .order("created_at", { ascending: false })
      .limit(8);
      
    if (error) {
      console.error("소설 정보를 가져오던 중 오류가 발생했습니다:", error);
      throw new Error("소설 정보를 가져오던 중 오류가 발생했습니다.");
    }
    
    return data || [];
  } catch (e) {
    console.error("소설 정보를 가져오는 중 오류 발생:", e);
    return [];
  }
}

export async function getTopNovelsByViews() {
  const supabase = await createClient();
  
  try {
    // 오늘 날짜 계산
    const today = new Date().toISOString().split('T')[0];
    
    // 1. top_novel_views 테이블에서 오늘의 인기 소설 가져오기
    const { data: topNovels, error: topNovelsError } = await (supabase as any)
      .from('top_novel_views')
      .select('*')
      .eq('calculated_date', today)
      .order('rank', { ascending: true });
    
    // 오늘 데이터가 있으면 바로 반환
    if (!topNovelsError && topNovels && topNovels.length > 0) {
      return topNovels;
    }
    
    // 2. 어제 날짜 계산
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // 3. 어제의 인기 소설 가져오기
    const { data: yesterdayTopNovels, error: yesterdayError } = await (supabase as any)
      .from('top_novel_views')
      .select('*')
      .eq('calculated_date', yesterdayStr)
      .order('rank', { ascending: true });
    
    // 어제 데이터가 있으면 반환
    if (!yesterdayError && yesterdayTopNovels && yesterdayTopNovels.length > 0) {
      return yesterdayTopNovels;
    }
    
    // 4. 데이터가 없는 경우 기본 추천 소설 반환
    return await getRecommendedNovels();
  } catch (e) {
    console.error("소설 조회수 정보를 가져오는 중 오류 발생:", e);
    // 오류 발생 시 기본 추천 소설 반환
    return await getRecommendedNovels();
  }
}

export async function deleteNovel(novelId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("novels")
    .delete({ count: "exact" })
    .eq("id", novelId);
  if (error) throw new Error("소설 삭제 중 오류가 발생했습니다.");
}
