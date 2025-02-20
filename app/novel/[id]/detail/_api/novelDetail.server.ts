import { createClient } from "@/utils/supabase/server";

export async function getNovelDetail(novelId: string) {
  const supabase = await createClient();
  const { data: novel, error: novelNotFound } = await supabase
    .from("novels")
    .select("*")
    .eq("id", novelId)
    .single();
  if (novelNotFound) {
    throw new Error("해당 id에 일치하는 소설이 없습니다.");
  }
  return novel;
}
