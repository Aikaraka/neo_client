import { createClient } from "@/utils/supabase/client";

export async function getNovel(novelId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("novels")
    .select("*")
    .eq("id", novelId)
    .single();
  if (error) throw new Error("소설 정보를 가져오던 중 오류가 발생했습니다.");
  return data;
}
