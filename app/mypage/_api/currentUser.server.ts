"use server";

import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("유저 정보를 가져오지 못했습니다.");
  }

  const userProfilePromise = supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const tokenPromise = supabase
    .from("user_ai_token")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const novelsPromise = supabase.from("novels").select("*").eq("user_id", user.id);

  const [
    { data: userData, error: notFoundError },
    { data: tokenData, error: tokenError },
    { data: novelData, error: novelError },
  ] = await Promise.all([userProfilePromise, tokenPromise, novelsPromise]);

  if (notFoundError) {
    throw new Error("유저 정보를 찾을 수 없습니다.");
  }
  if (tokenError) {
    throw new Error("유저 정보를 찾을 수 없습니다.");
  }
  if (novelError) {
    throw new Error("소설 정보를 가져오지 못했습니다.");
  }

  const result = { user: userData, token: tokenData, novels: novelData };
  return result;
}

export async function getLastViewedNovels() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error("유저 정보를 가져오지 못했습니다.");
  const { data: novels, error: novelNotFound } = await supabase
    .from("novel_views")
    .select(
      `
      novel_id,
      last_viewed_at,
      novels (
        id,
        title,
        image_url,
        mood,
        created_at
      )
    `
    )
    .eq("user_id", data.user.id)
    .order("last_viewed_at", { ascending: false });
  if (novelNotFound) throw new Error("유저 정보를 찾을 수 없습니다.");
  return novels;
}

export async function getLoginState() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new AuthError("유저 정보를 찾을 수 없습니다.");
  return;
}
