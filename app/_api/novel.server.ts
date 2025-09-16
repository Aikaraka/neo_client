"use server";

import { createClient } from "@/utils/supabase/server";

export async function getNovelDetail(novelId: string) {
  const supabase = await createClient();
  const { data: novel, error: novelNotFound } = await supabase
    .from("novels")
    .select(
      `
      *,
      users (
        nickname,
        avatar_url
      )
    `
    )
    .eq("id", novelId)
    .single();

  if (novelNotFound) {
    console.error("Novel not found error:", novelNotFound);
    throw new Error("해당 id에 일치하는 세계관이 없습니다.");
  }

  return novel;
}
