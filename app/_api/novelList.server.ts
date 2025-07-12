"use server";

import { createClient } from "@/utils/supabase/server";
import { Category } from "@/utils/supabase/types/database.types";
import { getUserSafeFilterStatus } from "@/app/_api/safeFilter.server";

// 보호필터 상태를 확인하는 헬퍼 함수
async function getSafeFilterEnabled() {
  try {
    const status = await getUserSafeFilterStatus();
    // 로그인 사용자는 DB에서 설정값 반환, 비로그인은 항상 true
    return status.safeFilterEnabled;
  } catch (error) {
    console.error("Failed to get user safe filter status:", error);
  }
  
  // 에러 발생 시 보호필터 ON
  return true;
}

export async function getRecommendedNovels() {
  const supabase = await createClient();
  const safeFilterEnabled = await getSafeFilterEnabled();
  
  let query = supabase
    .from("novels")
    .select("*")
    .filter("settings->isPublic", "eq", true)
    .order("created_at", { ascending: false })
    .limit(10);
  
  // 보호필터가 켜져 있으면 성인 콘텐츠 제외
  if (safeFilterEnabled) {
    query = query.or('settings->hasAdultContent.is.null,settings->hasAdultContent.eq.false');
  }
  
  const { data, error } = await query;

  if (error)
    throw new Error("추천 소설 정보를 가져오던 중 오류가 발생했습니다.");
  if (!data || data.length === 0) {
    console.log("선택된 추천 소설이 없습니다. 공개된 최신 소설을 가져옵니다.");

    const recentNovels = await getRecentNovels();
    return recentNovels;
  }
  return data;
}

export async function getNovels() {
  const supabase = await createClient();
  const safeFilterEnabled = await getSafeFilterEnabled();

  const { data: dailyRankings, error: dailyError } = await supabase.rpc(
    "get_latest_novel_rankings",
    { ranking_type_param: "daily" }
  );

  // 데이터가 있으면 바로 반환
  if (!dailyError && dailyRankings && dailyRankings.length > 0) {
    // 보호필터가 켜져 있으면 성인 콘텐츠 필터링
    if (safeFilterEnabled) {
      // 각 소설의 상세 정보를 가져와서 필터링
      const novelIds = dailyRankings.map(r => r.novel_id);
      const { data: novels } = await supabase
        .from("novels")
        .select("id, settings")
        .in("id", novelIds);
      
      if (novels) {
        const adultNovelIds = novels
          .filter(n => (n.settings as any)?.hasAdultContent === true)
          .map(n => n.id);
        
        return dailyRankings.filter(r => !adultNovelIds.includes(r.novel_id));
      }
    }
    return dailyRankings;
  }

  // 일별 랭킹이 없으면 전체 랭킹 조회
  const { data: allTimeRankings, error: allTimeError } = await supabase.rpc(
    "get_latest_novel_rankings",
    { ranking_type_param: "all_time" }
  );

  if (allTimeError) {
    throw new Error("소설 정보를 가져오던 중 오류가 발생했습니다.");
  }

  // 보호필터가 켜져 있으면 성인 콘텐츠 필터링
  if (safeFilterEnabled && allTimeRankings) {
    const novelIds = allTimeRankings.map(r => r.novel_id);
    const { data: novels } = await supabase
      .from("novels")
      .select("id, settings")
      .in("id", novelIds);
    
    if (novels) {
      const adultNovelIds = novels
        .filter(n => (n.settings as any)?.hasAdultContent === true)
        .map(n => n.id);
      
      return allTimeRankings.filter(r => !adultNovelIds.includes(r.novel_id));
    }
  }

  return allTimeRankings;
}


export async function getRecentNovels() {
  const supabase = await createClient();
  const safeFilterEnabled = await getSafeFilterEnabled();
  
  let query = supabase
    .from("novels")
    .select("*")
    .filter("settings->isPublic", "eq", true)
    .order("created_at", { ascending: false })
    .limit(10);
    
  // 보호필터가 켜져 있으면 성인 콘텐츠 제외
  if (safeFilterEnabled) {
    query = query.or('settings->hasAdultContent.is.null,settings->hasAdultContent.eq.false');
  }
  
  const { data, error } = await query;
  
  if (error)
    throw new Error("최신 소설 정보를 가져오던 중 오류가 발생했습니다.");
  return data;
}

export async function getNovelsByCategory(category: Category) {
  const supabase = await createClient();
  const safeFilterEnabled = await getSafeFilterEnabled();
  
  let query = supabase
    .from("novels")
    .select("*")
    .filter("settings->isPublic", "eq", true)
    .filter("mood", "cs", `{${category}}`)
    .limit(10);
    
  // 보호필터가 켜져 있으면 성인 콘텐츠 제외
  if (safeFilterEnabled) {
    query = query.or('settings->hasAdultContent.is.null,settings->hasAdultContent.eq.false');
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.log(error);
    throw new Error("카테고리별 소설 정보를 가져오던 중 오류가 발생했습니다.");
  }
  return data;
}

export async function getNovelsByView() {
  const supabase = await createClient();
  const safeFilterEnabled = await getSafeFilterEnabled();
  
  // 일별 인기 소설 가져오기 (저장된 랭킹 사용)
  const { data: dailyRankings, error: dailyError } = await supabase.rpc(
    "get_latest_novel_rankings",
    { ranking_type_param: "daily" }
  );

  if (dailyError) throw new Error("랭킹을 가져오던 중 오류가 발생했습니다.");
  
  // 데이터가 있으면 바로 반환
  if (dailyRankings && dailyRankings.length > 0) {
    // 보호필터가 켜져 있으면 성인 콘텐츠 필터링
    if (safeFilterEnabled) {
      const novelIds = dailyRankings.map(r => r.novel_id);
      const { data: novels } = await supabase
        .from("novels")
        .select("id, settings")
        .in("id", novelIds);
      
      if (novels) {
        const adultNovelIds = novels
          .filter(n => (n.settings as any)?.hasAdultContent === true)
          .map(n => n.id);
        
        return dailyRankings.filter(r => !adultNovelIds.includes(r.novel_id));
      }
    }
    return dailyRankings;
  }

  // 일별 랭킹이 없으면 전체 랭킹 조회
  const { data: allTimeRankings, error: allTimeError } = await supabase.rpc(
    "get_latest_novel_rankings",
    { ranking_type_param: "all_time" }
  );
  if (allTimeError) throw new Error("랭킹을 가져오던 중 오류가 발생했습니다.");
  
  // 보호필터가 켜져 있으면 성인 콘텐츠 필터링
  if (safeFilterEnabled && allTimeRankings) {
    const novelIds = allTimeRankings.map(r => r.novel_id);
    const { data: novels } = await supabase
      .from("novels")
      .select("id, settings")
      .in("id", novelIds);
    
    if (novels) {
      const adultNovelIds = novels
        .filter(n => (n.settings as any)?.hasAdultContent === true)
        .map(n => n.id);
      
      return allTimeRankings.filter(r => !adultNovelIds.includes(r.novel_id));
    }
  }
  
  return allTimeRankings;
}
