"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateNickname(newNickname: string) {
  const supabase = await createClient();
  
  // 현재 로그인한 사용자 정보 가져오기
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: { message: "인증되지 않은 사용자입니다." } };
  }
  
  // 닉네임 유효성 검사
  if (!newNickname || newNickname.trim().length === 0) {
    return { error: { message: "닉네임을 입력해주세요." } };
  }
  
  if (newNickname.length < 2 || newNickname.length > 20) {
    return { error: { message: "닉네임은 2자 이상 20자 이하로 입력해주세요." } };
  }
  
  // 닉네임 중복 확인
  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("id")
    .eq("nickname", newNickname)
    .neq("id", user.id)
    .single();
    
  if (existingUser) {
    return { error: { message: "이미 사용 중인 닉네임입니다." } };
  }
  
  // 닉네임 업데이트
  const { data, error } = await supabase
    .from("users")
    .update({ nickname: newNickname })
    .eq("id", user.id)
    .select()
    .single();
    
  if (error) {
    return { error: { message: "닉네임 변경에 실패했습니다." } };
  }
  
  // 페이지 재검증
  revalidatePath("/mypage");
  
  return { data };
}
