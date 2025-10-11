"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveSearchTerm(searchTerm: string) {
  if (searchTerm.trim() === "") return;

  const supabase = await createClient();

  // 현재 로그인한 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // 이미 존재하는 검색어인 경우 created_at만 업데이트
  const { error } = await supabase.from("search_history").upsert(
    {
      user_id: user.id,
      search_term: searchTerm.trim(),
      created_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,search_term",
    }
  );

  if (error) throw new Error("검색어 저장 중 오류가 발생했습니다.");
}

export async function getRecentSearchTerms(limit = 5) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // 최근 검색어 조회
  const { data, error } = await supabase
    .from("search_history")
    .select("search_term, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("최근 검색어 조회 중 오류가 발생했습니다:", error);
    return [];
  }

  return data || [];
}

export async function deleteSearchTerm(searchTerm: string) {
  if (!searchTerm) return;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }

  const { error } = await supabase
    .from("search_history")
    .delete()
    .eq("user_id", user.id)
    .eq("search_term", searchTerm);

  if (error) throw new Error("검색어 삭제 중 오류가 발생했습니다.");
}

export async function clearAllSearchTerms() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }

  // 모든 검색어 삭제
  const { error } = await supabase
    .from("search_history")
    .delete()
    .eq("user_id", user.id);

  if (error) throw new Error("모든 검색어 삭제 중 오류가 발생했습니다.");
}
