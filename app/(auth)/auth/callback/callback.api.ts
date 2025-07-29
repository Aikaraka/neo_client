import { Session } from "@supabase/supabase-js";
import { SupabaseClient } from "@supabase/supabase-js";

export const getuser = (session: Session | null, supabase: SupabaseClient) =>
  supabase.from("users").select().eq("id", session?.user.id).single();

export const getSession = (supabase: SupabaseClient) => supabase.auth.getSession();

export const insertNewUser = async (session: Session | null, supabase: SupabaseClient) => {
  if (!session?.user) {
    return { error: new Error("세션 정보가 없습니다.") };
  }

  // 중복 확인을 위해 먼저 사용자 존재 여부 체크
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", session.user.id)
    .single();

  if (existingUser) {
    console.log("사용자가 이미 존재합니다:", session.user.id);
    return { data: existingUser, error: null };
  }

  // 사용자 삽입 - 기본값: is_adult = false, safe_filter_enabled = true
  return supabase.from("users").insert([
    {
      id: session.user.id,
      email: session.user.email || "",
      auth_provider: session.user.app_metadata.provider || "email",
      created_at: new Date().toISOString(),
      is_adult: false,
      safe_filter_enabled: true,
    },
  ]);
};
