import { NextResponse } from "next/server";

export const runtime = 'edge'; // optional - 엣지 런타임 사용

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // API 키 확인
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      console.error('API 키가 설정되지 않음');
      return NextResponse.json(
        { error: "API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    console.log('Stability AI 요청 시작:', body.prompt); // 디버깅용

    // Stability AI API 호출
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: body.prompt, weight: 1 }],
          samples: 2,
          steps: 30,
          width: 768,
          height: 1344,
          cfg_scale: 7,
          style_preset: "photographic"
        }),
      }
    );

    console.log('Stability AI 응답 상태:', response.status); // 디버깅용

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stability AI 에러:', errorText);
      return NextResponse.json(
        { error: "이미지 생성에 실패했습니다." },
        { status: response.status }
      );
    }

    const result = await response.json();
    const images = result.artifacts.map((artifact: any) => 
      `data:image/png;base64,${artifact.base64}`
    );

    console.log('이미지 생성 성공'); // 디버깅용
    return NextResponse.json({ images });

  } catch (error: any) {
    console.error('서버 에러:', error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}