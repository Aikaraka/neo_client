"use server";

import { createClient } from "@/utils/supabase/server";
import { Category } from "@/utils/supabase/types/database.types";
import { getUserSafeFilterStatus } from "@/app/_api/safeFilter.server";

type NovelSettings = {
  hasAdultContent?: boolean;
  isPublic?: boolean;
};

// RPC 랭킹 결과 타입(필요 필드만 정의)
interface RankingRow {
  novel_id: string;
  // 필요한 경우 아래에 추가 필드 정의
}

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
    throw new Error("추천 세계관 정보를 가져오던 중 오류가 발생했습니다.");
  if (!data || data.length === 0) {
    console.log("선택된 추천 세계관이 없습니다. 공개된 최신 세계관을 가져옵니다.");

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
      const novelIds = (dailyRankings as RankingRow[]).map((r: RankingRow) => r.novel_id);
      const { data: novels } = await supabase
        .from("novels")
        .select("id, settings")
        .in("id", novelIds);
      
      if (novels) {
        const excludedNovelIds = novels
          .filter(n => {
            const settings = n.settings as NovelSettings
            // 보호필터가 켜져있고 성인 콘텐츠이거나, 공개되지 않은 콘텐츠 필터링
            return (
              (safeFilterEnabled && settings?.hasAdultContent === true) ||
              settings?.isPublic !== true
            )
          })
          .map(n => n.id)

        return (dailyRankings as RankingRow[]).filter(
          r => !excludedNovelIds.includes(r.novel_id)
        )
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
    throw new Error("세계관 정보를 가져오던 중 오류가 발생했습니다.");
  }

  // 보호필터가 켜져 있으면 성인 콘텐츠 필터링
  if (safeFilterEnabled && allTimeRankings) {
    const novelIds = (allTimeRankings as RankingRow[]).map((r: RankingRow) => r.novel_id);
    const { data: novels } = await supabase
      .from("novels")
      .select("id, settings")
      .in("id", novelIds);
    
    if (novels) {
      const excludedNovelIds = novels
        .filter(n => {
          const settings = n.settings as NovelSettings
          // 보호필터가 켜져있고 성인 콘텐츠이거나, 공개되지 않은 콘텐츠 필터링
          return (
            (safeFilterEnabled && settings?.hasAdultContent === true) ||
            settings?.isPublic !== true
          )
        })
        .map(n => n.id)

      return (allTimeRankings as RankingRow[]).filter(
        r => !excludedNovelIds.includes(r.novel_id)
      )
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
    throw new Error("최신 세계관 정보를 가져오던 중 오류가 발생했습니다.");
  return data;
}

export async function getNovelsForGenreList() {
  const supabase = await createClient();
  const safeFilterEnabled = await getSafeFilterEnabled();

  let query = supabase
    .from("novels")
    .select("*")
    .filter("settings->isPublic", "eq", true)
    .order("created_at", { ascending: false })
    .limit(100);

  // 보호필터가 켜져 있으면 성인 콘텐츠 제외
  if (safeFilterEnabled) {
    query = query.or(
      "settings->hasAdultContent.is.null,settings->hasAdultContent.eq.false"
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching novels for genre list:", error);
    throw new Error("장르별 세계관 목록을 가져오던 중 오류가 발생했습니다.");
  }

  return data || [];
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
    throw new Error("카테고리별 세계관 정보를 가져오던 중 오류가 발생했습니다.");
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
      const novelIds = (dailyRankings as RankingRow[]).map((r: RankingRow) => r.novel_id);
      const { data: novels } = await supabase
        .from("novels")
        .select("id, settings")
        .in("id", novelIds);
      
      if (novels) {
        const excludedNovelIds = novels
          .filter(n => {
            const settings = n.settings as NovelSettings
            // 보호필터가 켜져있고 성인 콘텐츠이거나, 공개되지 않은 콘텐츠 필터링
            return (
              (safeFilterEnabled && settings?.hasAdultContent === true) ||
              settings?.isPublic !== true
            )
          })
          .map(n => n.id)

        return (dailyRankings as RankingRow[]).filter(
          r => !excludedNovelIds.includes(r.novel_id)
        )
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
    const novelIds = (allTimeRankings as RankingRow[]).map((r: RankingRow) => r.novel_id);
    const { data: novels } = await supabase
      .from("novels")
      .select("id, settings")
      .in("id", novelIds);
    
    if (novels) {
      const excludedNovelIds = novels
        .filter(n => {
          const settings = n.settings as NovelSettings
          // 보호필터가 켜져있고 성인 콘텐츠이거나, 공개되지 않은 콘텐츠 필터링
          return (
            (safeFilterEnabled && settings?.hasAdultContent === true) ||
            settings?.isPublic !== true
          )
        })
        .map(n => n.id)

      return (allTimeRankings as RankingRow[]).filter(
        r => !excludedNovelIds.includes(r.novel_id)
      )
    }
  }
  
  return allTimeRankings;
}
