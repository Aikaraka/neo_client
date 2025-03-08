"use server";

import { createClient } from "@/utils/supabase/server";

export async function getRecommendedNovels() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("novels").select("*").limit(8);

  if (error) throw new Error("소설 정보를 가져오던 중 오류가 발생했습니다.");
  return data;
}

export async function getTopNovels() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("novels").select("*").limit(8);
  if (error) throw new Error("소설 정보를 가져오던 중 오류가 발생했습니다.");
  return data;
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
