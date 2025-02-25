"use server";

import { createAdminClient } from "@/utils/supabase/server";

export async function withDrawAccount() {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) throw new Error("유저 정보를 찾지 못했습니다.");

  const { error } = await supabase.auth.admin.deleteUser(user.id);
  console.log(error);
  if (error) throw new Error("회원탈퇴 중 오류가 발생했습니다.");
  await supabase.auth.signOut();
}
