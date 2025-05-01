"use server";

import { novelAIServer } from "@/app/novel/_api";
import { LibraryNovel } from "@/types/library";
import { createClient, getToken } from "@/utils/supabase/server";

export async function getMyNovelList(): Promise<LibraryNovel[]> {
  const accessToken = await getToken();

  const data = await (
    await novelAIServer.get("/api/library", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  ).json();

  console.log("getMyNovelList", data);

  return data;
}

export async function deleteNovel(novelId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("novels").delete().eq("id", novelId);
  if (error) throw new Error("소설 삭제 중 오류가 발생했습니다.");
  return;
}
