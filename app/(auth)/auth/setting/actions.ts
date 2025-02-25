"use server";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export const initialProfileSubmit = async (
  name: string,
  nickname: string,
  birthdate: string,
  gender: string
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("사용자 정보를 찾을 수 없습니다.");

  await updateUser(name, nickname, birthdate, gender, user.id, supabase);
};

const updateUser = async (
  name: string,
  nickname: string,
  birthdate: string,
  gender: string,
  userId: string,
  supabase: SupabaseClient
) => {
  const { error: updateError } = await supabase
    .from("users")
    .update({
      name,
      nickname,
      birthdate,
      gender,
      profile_completed: true,
    })
    .eq("id", userId);
  if (updateError) throw new Error("프로필 업데이트 중 오류가 발생했습니다.");
};
