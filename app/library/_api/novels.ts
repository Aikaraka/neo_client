"use server";

import { novelAiServerForServer } from "@/api/serverInstance";
import { LibraryNovel } from "@/types/library";
import { createClient, getToken } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMyNovelList(): Promise<LibraryNovel[]> {
  const accessToken = await getToken();

  const data = await (
    await novelAiServerForServer.get("/api/library", {
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

  try {
    // 4. 소설 삭제 실행
    const { error: deleteError } = await supabase.from("novels").delete().eq("id", novelId);

    if (deleteError) {
      console.error("Novel deletion error:", deleteError);
      throw new Error("소설을 삭제하는 중 데이터베이스 오류가 발생했습니다.");
    }

    // 5. 관련 페이지 캐시 무효화 (UI 즉시 반영)
    revalidatePath("/admin/novels");
    revalidatePath("/library");

    return { success: "소설이 성공적으로 삭제되었습니다." };
  } catch (e) {
    const error = e as Error;
    console.error("Unexpected error in deleteNovel:", error);
    // 이미 발생한 에러는 다시 던져서 클라이언트가 처리하도록 함
    throw error;
  }
}
