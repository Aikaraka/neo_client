"use server";
import { createClient } from "@/utils/supabase/server";

export const initialProfileSubmit = async (
  name: string,
  nickname: string,
  birthdate: string,
  gender: string,
  marketing: boolean
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("사용자 정보를 찾을 수 없습니다.");

  const { error: updateError } = await supabase
    .from("users")
    .update({
      name,
      nickname,
      birthdate,
      gender,
      profile_completed: true,
      marketing,
    })
    .eq("id", user.id);
  if (updateError) throw new Error("프로필 업데이트 중 오류가 발생했습니다.");
};
