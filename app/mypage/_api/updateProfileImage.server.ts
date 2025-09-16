"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileImage(formData: FormData) {
  const supabase = await createClient();

  // 1. 현재 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: { message: "로그인이 필요합니다." } };
  }

  // 2. FormData에서 파일 가져오기
  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) {
    return { error: { message: "이미지 파일이 필요합니다." } };
  }

  // 3. 고유한 파일 경로 생성 (중복 방지)
  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/${Date.now()}.${fileExt}`;

  // 4. Supabase Storage에 이미지 업로드
  const { error: uploadError } = await supabase.storage
    .from("avatars") // 생성하신 버킷 이름
    .upload(filePath, file);

  if (uploadError) {
    console.error("Storage Upload Error:", uploadError);
    return { error: { message: "이미지 업로드에 실패했습니다." } };
  }

  // 5. 업로드된 이미지의 Public URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  if (!publicUrl) {
    return { error: { message: "이미지 URL을 가져오는데 실패했습니다." } };
  }

  // 6. users 테이블에 Public URL 업데이트 (update 사용)
  const { error: dbError } = await supabase
    .from("users")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (dbError) {
    console.error("Database Update Error:", dbError);
    return { error: { message: "데이터베이스 업데이트에 실패했습니다." } };
  }

  // 7. 마이페이지 캐시 무효화로 변경사항 즉시 반영
  revalidatePath("/mypage");

  return { success: true, newUrl: publicUrl };
}
