"use server";

import { createClient } from "@/utils/supabase/server";

export async function getSearchResult(keyword: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("novels")
    .select("*")
    .ilike("title", `%${decodeURIComponent(keyword)}%`)
    .order("title", { ascending: true });
  if (error) throw new Error("검색 결과를 가져오던 중 오류가 발생했습니다.");
  return data;
}
