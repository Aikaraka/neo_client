"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error("유저 정보를 가져오지 못했습니다.");
  const { data: userData, error: notFoundError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (notFoundError) {
    throw new Error("유저 정보를 찾을 수 없습니다.");
  }
  const { data: tokenData, error: tokenError } = await supabase
    .from("user_ai_token")
    .select("*")
    .eq("user_id", data.user.id)
    .single();
  if (tokenError) throw new Error("유저 정보를 찾을 수 없습니다.");

  const { data: novelData, error: novelError } = await supabase
    .from("novels")
    .select("*")
    .eq("user_id", data.user.id);
  if (novelError) throw new Error("소설 정보를 가져오지 못했습니다.");
  const result = { user: userData, token: tokenData, novels: novelData };
  console.log(result);
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
