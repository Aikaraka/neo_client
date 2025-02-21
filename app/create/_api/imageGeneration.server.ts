"use server";

import { createClient } from "@/utils/supabase/server";

export async function generateImage(prompt: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) throw new Error("유저 정보를 찾을 수 없습니다.");

  const { data: aiUsage, error: aiUsageError } = await supabase
    .from("user_ai_usage")
    .select("remaining_generations")
    .eq("user_id", user.id)
    .single();

  if (aiUsageError) throw new Error("사용 횟수를 검색 중 오류가 발생했습니다.");

  if (!aiUsage) {
    const { data: newData, error: insertError } = await supabase
      .from("user_ai_usage")
      .insert([{ user_id: user.id, remaining_generations: 3 }])
      .select()
      .single();
    if (insertError)
      throw new Error("사용 횟수를 갱신 중 오류가 발생했습니다.");
  }
  const remained = aiUsage.remaining_generations ?? 3;
  if (!remained) throw new Error("모든 요청 횟수를 사용했습니다.");

  const { error } = await supabase
    .from("user_ai_usage")
    .update({
      remaining_generations: remained - 1,
    })
    .eq("user_id", user.id);
  if (error) throw new Error("사용 횟수를 갱신 중 오류가 발생했습니다.");

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError) {
    throw new Error("유저 정보를 갱신하던 중 오류가 발생했습니다.");
  }

  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) throw new Error("서버와의 에러가 발생했습니다.");

  // Stability AI API 호출
  const response = await fetch(
    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt, weight: 1 }],
        samples: 2,
        steps: 30,
        width: 768,
        height: 1344,
        cfg_scale: 7,
        style_preset: "photographic",
      }),
    }
  );

  console.log("Stability AI 응답 상태:", response.status); // 디버깅용

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Stability AI 에러:", errorText);
    throw new Error("ai 요청에 실패했습니다.");
  }

  const result = await response.json();
  const images = result.artifacts.map(
    (artifact: any) => `data:image/png;base64,${artifact.base64}`
  );
  return images;
}
