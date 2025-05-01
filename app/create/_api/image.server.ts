"use server";

import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { novelAIServer } from "@/app/novel/_api";

type GenerateImageResponse = {
  success: boolean;
  urls: Array<string>;
};
export async function generateImage(
  novelForm: CreateNovelForm
): Promise<GenerateImageResponse> {
  const response = await novelAIServer.post(
    "/api/novel/generate-covers",
    novelForm
  );
  const data = await response.json();
  if (!data.success) {
    console.error("이미지 생성 실패", data);
    throw new Error("이미지 생성 실패");
  }
  return data;
}
