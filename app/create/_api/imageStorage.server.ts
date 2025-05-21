"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveBase64ToStorage(base64Data: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError)
    throw new Error("유저 정보를 가져오던 중 오류가 발생했습니다.");

  const blob = await fetch(base64Data).then((res) => res.blob());

  const fileName = `${Date.now()}.png`;
  const filePath = `${user.id}/${fileName}`;

  // Storage에 업로드
  const { error: uploadError } = await supabase.storage
    .from("novel-covers")
    .upload(filePath, blob, {
      contentType: "image/png",
    });

  if (uploadError)
    throw new Error("이미지를 업로드하던 중 오류가 발생했습니다.");

  const {
    data: { publicUrl },
  } = supabase.storage.from("novel-covers").getPublicUrl(filePath);
  if (!publicUrl) throw new Error("이미지를 찾지 못했습니다.");

  return publicUrl;
}

export async function saveImageFileToStorage(file: File) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("novel-covers")
    .upload(filePath, file);

  if (uploadError) throw new Error("이미지 업로드 중 오류가 발생했습니다.");

  const {
    data: { publicUrl },
  } = supabase.storage.from("novel-covers").getPublicUrl(filePath);

  if (!publicUrl) {
    throw new Error(
      "업로드된 이미지의 공개 URL을 가져오지 못했습니다. 스토리지 설정을 확인해주세요.",
    );
  }
  
  return publicUrl;
}
