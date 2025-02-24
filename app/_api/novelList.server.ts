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

export async function deleteNovel(novelId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("novels")
    .delete({ count: "exact" })
    .eq("id", novelId);
  if (error) throw new Error("소설 삭제 중 오류가 발생했습니다.");
}
