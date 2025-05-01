"use server";

import { createClient } from "@/utils/supabase/server";
import { Category } from "@/utils/supabase/types/database.types";

export async function getRecommendedNovels() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("novels")
    .select("*")
    .filter("settings->isPublic", "eq", true)
    .order("created_at", { ascending: false })
    .limit(8);

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

  const { data: dailyRankings, error: dailyError } = await supabase.rpc(
    "get_latest_novel_rankings",
    { ranking_type_param: "daily" }
  );

  // 데이터가 있으면 바로 반환
  if (!dailyError && dailyRankings && dailyRankings.length > 0) {
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

  return allTimeRankings;
}

export async function deleteNovel(novelId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("novels")
    .delete({ count: "exact" })
    .eq("id", novelId);
  if (error) throw new Error("소설 삭제 중 오류가 발생했습니다.");
}

export async function getRecentNovels() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("novels")
    .select("*")
    .filter("settings->isPublic", "eq", true)
    .order("created_at", { ascending: false })
    .limit(8);
  if (error)
    throw new Error("최신 소설 정보를 가져오던 중 오류가 발생했습니다.");
  return data;
}

export async function getNovelsByCategory(category: Category) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("novels")
    .select("*")
    .filter("mood", "cs", `{${category}}`)
    .limit(8);
  if (error) {
    console.log(error);
    throw new Error("카테고리별 소설 정보를 가져오던 중 오류가 발생했습니다.");
  }
  return data;
}

export async function getNovelsByView() {
  const supabase = await createClient();
  // 일별 인기 소설 가져오기 (저장된 랭킹 사용)
  const { data: dailyRankings, error: dailyError } = await supabase.rpc(
    "get_latest_novel_rankings",
    { ranking_type_param: "daily" }
  );

  if (dailyError) throw new Error("랭킹을 가져오던 중 오류가 발생했습니다.");
  // 데이터가 있으면 바로 반환
  if (dailyRankings && dailyRankings.length > 0) {
    return dailyRankings;
  }

  // 일별 랭킹이 없으면 전체 랭킹 조회
  const { data: allTimeRankings, error: allTimeError } = await supabase.rpc(
    "get_latest_novel_rankings",
    { ranking_type_param: "all_time" }
  );
  if (allTimeError) throw new Error("랭킹을 가져오던 중 오류가 발생했습니다.");
  return allTimeRankings;
}
