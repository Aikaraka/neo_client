"use server";

import { createClient } from "@/utils/supabase/server";

export async function getMyNovels() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error("유저 정보를 가져오지 못했습니다.");
  const { data: novelData, error: novelError } = await supabase
    .from("novels")
    .select("*")
    .eq("user_id", userData.user.id);
  if (novelError)
    throw new Error("소설 목록을 불러오는 중에 오류가 발생했습니다.");
  return novelData;
}
