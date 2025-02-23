"use server";

import { createClient } from "@/utils/supabase/server";

export async function getMyNovelList() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError)
    throw new Error("유저 정보를 가져오던 중 오류가 발생했습니다.");

  const { data, error: novelError } = await supabase
    .from("novels")
    .select("*")
    .eq("user_id", user.id);
  if (novelError) throw new Error("소설을 가져오던 중 오류가 발생했습니다.");
  return data;
}

export async function deleteNovel(novelId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("novels")
    .delete()
    .eq("id", novelId);
  if (error) throw new Error("소설 삭제 중 오류가 발생했습니다.");
  console.log(error, data, novelId);
  return;
}
