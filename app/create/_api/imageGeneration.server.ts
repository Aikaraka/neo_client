"use server";

import { createClient } from "@/utils/supabase/server";

export async function generateImage(prompt: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) throw new Error("유저 정보를 찾을 수 없습니다.");

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

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Stability AI 에러:", errorText);
    throw new Error("ai 요청에 실패했습니다.");
  }

  interface StabilityArtifact {
    base64: string;
  }

  interface StabilityResult {
    artifacts: StabilityArtifact[];
  }

  const result: StabilityResult = await response.json();
  const images = result.artifacts.map(
    (artifact) => `data:image/png;base64,${artifact.base64}`
  );
  return images;
}
