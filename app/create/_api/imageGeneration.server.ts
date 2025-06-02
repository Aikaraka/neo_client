"use server";

import { createClient } from "@/utils/supabase/server";
import * as Sentry from "@sentry/nextjs";

export async function generateImage(prompt: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    Sentry.captureException(new Error("User authentication failed"), {
      tags: { error_type: "auth_error", context: "image_generation" }
    });
    throw new Error("유저 정보를 찾을 수 없습니다.");
  }

  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    console.error("STABILITY_API_KEY가 설정되지 않았습니다.");
    Sentry.captureException(new Error("Missing STABILITY_API_KEY"), {
      tags: { error_type: "config_error", context: "image_generation" }
    });
    throw new Error("AI 이미지 생성 서비스가 현재 사용할 수 없습니다.");
  }

  try {
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
      console.error("Stability AI API 에러:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      Sentry.captureException(new Error(`Stability AI API error: ${response.status}`), {
        tags: { error_type: "api_error", context: "image_generation" },
        extra: { status: response.status, errorText }
      });
      
      throw new Error("AI 이미지 생성 요청에 실패했습니다.");
    }

    interface StabilityArtifact {
      base64: string;
    }

    interface StabilityResult {
      artifacts: StabilityArtifact[];
    }

    const result: StabilityResult = await response.json();
    
    if (!result.artifacts || result.artifacts.length === 0) {
      throw new Error("생성된 이미지가 없습니다.");
    }
    
    const images = result.artifacts.map(
      (artifact) => `data:image/png;base64,${artifact.base64}`
    );
    
    console.log(`성공적으로 ${images.length}개의 이미지를 생성했습니다.`);
    return images;
    
  } catch (error) {
    console.error("이미지 생성 중 에러:", error);
    Sentry.captureException(error, {
      tags: { error_type: "generation_error", context: "image_generation" },
      extra: { prompt }
    });
    throw error;
  }
}
