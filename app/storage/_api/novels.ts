"use server"; // 파일 전체를 서버 액션 모듈로 선언

import { createClient } from "@/utils/supabase/server";

/* // getMyNovelList는 더 이상 사용되지 않으므로 주석 처리
export async function getMyNovelList() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError)
    throw new Error("유저 정보를 가져오던 중 오류가 발생했습니다.");

  const { data, error: novelError } = await supabase
    .from("novel_views")
    .select("user_id, novel_id, novels(*)")
    .eq("user_id", user.id);
  if (novelError) throw new Error("소설을 가져오던 중 오류가 발생했습니다.");
  return data;
}
*/

export async function deleteNovel(novelId: string) {
  // 만약 NovelStorageList에서 useMutation으로 직접 호출한다면 클라이언트 측 API 호출로 변경해야 할 수 있음.
  // 만약 오류 발생 시 클라이언트 측 API 엔드포인트를 만들어 호출하도록 수정 필요.
  const supabase = await createClient();

  const { error } = await supabase.from("novels").delete().eq("id", novelId);
  if (error) throw new Error("소설 삭제 중 오류가 발생했습니다.");
  return;
}
