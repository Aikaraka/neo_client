"use client";

import AiAssistButton from "@/app/create/_components/aiAssist";
import CoverImageEditor from "@/app/create/_components/coverImageEditor/CoverImageEditor";
import { CharacterForm } from "@/app/create/_components/CharacterForm";
import { RelationshipForm } from "@/app/create/_components/RelationshipForm";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { Input } from "@/components/ui/input";
import { usePageContext } from "@/components/ui/pageContext";
import { useToast } from "@/hooks/use-toast";
import { useFormContext } from "react-hook-form";
import { useCoverImageContext } from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import { useState } from "react";

const TOAST_IMAGE_REQUIRED_TITLE = "표지 이미지 필요";
const TOAST_IMAGE_REQUIRED_DESCRIPTION = "표지 이미지를 업로드하거나 AI로 생성해주세요.";
const TOAST_IMAGE_CAPTURE_ERROR_TITLE = "이미지 처리 오류";
const TOAST_IMAGE_CAPTURE_ERROR_DESCRIPTION = "표지 이미지 처리에 실패했습니다. 다시 시도해주세요.";

export default function CharactorAndPlotDesign() {
  const { toast } = useToast();
  const { nextPage, setCapturedImageDataUrl } = usePageContext();
  const { imageSrc, coverImageRef, isCoverBgImageLoaded, fontTheme } = useCoverImageContext();
  const {
    formState: { errors },
    trigger,
    setValue,
    watch,
    register,
  } = useFormContext<CreateNovelForm>();

  const [isCapturing, setIsCapturing] = useState(false);

  const plot = watch("plot");
  const title = watch("title");

  // 그라디언트 색상 배열 반환 함수
  const getGradientColors = (fontTheme: string): string[] => {
    switch (fontTheme) {
      case 'sunset':
        return ['#ff7e5f', '#feb47b']; // 원래 선셋 색상 복구
      case 'ocean':
        return ['#0072ff', '#00c6ff']; // 원래 오션 색상 복구
      case 'pastel':
        return ['#fbc2eb', '#a6c1ee']; // 원래 파스텔 색상 복구
      case 'rainbow':
        return ['#ff6ec4', '#7873f5', '#42e695', '#fdd819']; // 원래 무지개 색상 복구
      case 'fire':
        return ['#f12711', '#f5af19']; // 원래 화재 색상 복구
      case 'black':
        return ['#000000', '#434343']; // 원래 검은색 복구
      default:
        return ['#0072ff', '#00c6ff']; // 기본값도 원래대로
    }
  };

  // Canvas를 사용한 직접 캡처 함수 (그라디언트 테두리 포함)
  const captureWithCanvas = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const editorElement = coverImageRef.current;
      if (!editorElement) {
        reject(new Error("편집기 요소를 찾을 수 없습니다."));
        return;
      }

      // Canvas 생성
      const canvas = document.createElement('canvas');
      const scale = 1; // 유저가 본 크기와 동일하게 저장
      canvas.width = 210 * scale;
      canvas.height = 270 * scale;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error("Canvas context를 생성할 수 없습니다."));
        return;
      }

      // 스케일 적용
      ctx.scale(scale, scale);

      // 배경 이미지 그리기
      if (imageSrc) {
        const bgImage = new window.Image();
        bgImage.crossOrigin = 'anonymous';
        
        bgImage.onload = () => {
          // 배경 이미지 그리기 (object-cover와 동일한 방식)
          const targetWidth = 210;
          const targetHeight = 270;
          const targetAspect = targetWidth / targetHeight;
          const imageAspect = bgImage.naturalWidth / bgImage.naturalHeight;

          let sourceX = 0;
          let sourceY = 0;
          let sourceWidth = bgImage.naturalWidth;
          let sourceHeight = bgImage.naturalHeight;

          // CoverImageEditor의 object-cover CSS와 동일한 로직 적용
          // 이렇게 해야 유저가 본 것과 저장되는 것이 일치함
          if (imageAspect > targetAspect) {
            // 이미지가 더 넓음 - 좌우 잘림
            sourceHeight = bgImage.naturalHeight;
            sourceWidth = sourceHeight * targetAspect;
            sourceX = (bgImage.naturalWidth - sourceWidth) / 2;
            sourceY = 0;
          } else if (imageAspect < targetAspect) {
            // 이미지가 더 높음 - 상하 잘림
            sourceWidth = bgImage.naturalWidth;
            sourceHeight = sourceWidth / targetAspect;
            sourceX = 0;
            sourceY = (bgImage.naturalHeight - sourceHeight) / 2;
          }
          // 비율이 같으면 sourceX, sourceY, sourceWidth, sourceHeight는 초기값 그대로

          ctx.drawImage(
            bgImage,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, targetWidth, targetHeight
          );

          // 제목 텍스트 그리기
          const titleElement = editorElement.querySelector('.text-box');
          const titleContainer = titleElement?.closest('.cover-title-drag-handle');
          if (titleElement && titleContainer) {
            const computedStyle = window.getComputedStyle(titleElement);
            const fontSize = parseInt(computedStyle.fontSize);
            const fontFamily = computedStyle.fontFamily;

            // 컨테이너의 실제 위치와 크기 가져오기
            const containerRect = (titleContainer as HTMLElement).getBoundingClientRect();
            const editorRect = editorElement.getBoundingClientRect();
            const x = containerRect.left - editorRect.left;
            const y = containerRect.top - editorRect.top;
            const width = containerRect.width;

            // 배경 이미지 object-cover 보정
            // CoverImageEditor와 동일하게 상하 잘림을 반영해야 함
            if (imageAspect < targetAspect) {
              // 이미지가 더 높음 - 상하 잘림
              // sourceY만큼 위쪽이 잘렸으므로, 제목의 Y 좌표를 그만큼 조정할 필요는 없음
              // 왜냐하면 Canvas에 이미 sourceY부터 그려지기 때문
              // 제목 좌표는 210x270 컨테이너 기준이고, Canvas도 210x270이므로 그대로 사용
            }

            // 제목 텍스트 가져오기 (HTML 태그 완전 제거)
            let titleText = titleElement.textContent || '';
            
            // tiptap에서 오는 HTML 태그 제거
            titleText = titleText.replace(/<[^>]*>/g, '').trim();
            
            // 폰트 설정
            ctx.font = `bold ${fontSize}px ${fontFamily}`;
            ctx.textBaseline = 'top';
            
            // 자동 줄바꿈 함수 (한국어 지원)
            const wrapText = (text: string, maxWidth: number): string[] => {
              const lines: string[] = [];
              
              // 띄어쓰기로 먼저 나누기
              const words = text.split(' ');
              let currentLine = '';

              for (const word of words) {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const testWidth = ctx.measureText(testLine).width;
                
                if (testWidth <= maxWidth) {
                  currentLine = testLine;
                } else {
                  // 현재 줄이 비어있지 않으면 저장
                  if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                  } else {
                    // 단어 자체가 너무 긴 경우 글자 단위로 자르기
                    let charLine = '';
                    for (const char of word) {
                      const charTestLine = charLine + char;
                      const charTestWidth = ctx.measureText(charTestLine).width;
                      
                      if (charTestWidth <= maxWidth) {
                        charLine = charTestLine;
                      } else {
                        if (charLine) lines.push(charLine);
                        charLine = char;
                      }
                    }
                    if (charLine) currentLine = charLine;
                  }
                }
              }
              
              // 마지막 줄 추가
              if (currentLine) lines.push(currentLine);
              
              return lines.length > 0 ? lines : [text];
            };
            
            // 그라디언트 색상
            const gradientColors = getGradientColors(fontTheme);
            
            // Canvas 네이티브 그라디언트 사용
            const gradient = ctx.createRadialGradient(x + 50, y + 20, 0, x + 50, y + 20, 100);
            gradientColors.forEach((color, index) => {
              gradient.addColorStop(index / (gradientColors.length - 1), color);
            });
            
            // 텍스트 자동 줄바꿈 (실제 박스 너비에 맞게)
            const maxTextWidth = width - 10; // 실제 박스 너비에서 여백 제외
            const lines = wrapText(titleText, maxTextWidth);
            const lineHeight = fontSize * 1.2;

            // 그라디언트 테두리
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 8;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            lines.forEach((line, index) => {
              const textY = y + (index * lineHeight);
              ctx.strokeText(line, x, textY);
            });

            // 메인 텍스트 (흰색)
            ctx.fillStyle = 'white';

            lines.forEach((line, index) => {
              const textY = y + (index * lineHeight);
              ctx.fillText(line, x, textY);
            });
          }

          // Canvas를 Data URL로 변환 (고해상도)
          const finalDataUrl = canvas.toDataURL('image/png', 1.0);
          resolve(finalDataUrl);
        };
        
        bgImage.onerror = () => {
          reject(new Error("배경 이미지를 로드할 수 없습니다."));
        };
        
        bgImage.src = imageSrc;
      } else {
        // 배경 이미지가 없는 경우 흰색 배경
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 210, 270);
        resolve(canvas.toDataURL('image/png', 1.0));
      }
    });
  };

  const handleNext = async () => {
    if (isCapturing) return;

    if (!imageSrc) {
      toast({
        title: TOAST_IMAGE_REQUIRED_TITLE,
        description: TOAST_IMAGE_REQUIRED_DESCRIPTION,
        variant: "destructive",
      });
      return;
    }

    const result = await trigger(["title", "plot", "characters"]);
    if (!result) {
      const messages = [];
      if (errors.title?.message) {
        messages.push(`- 제목: ${errors.title.message}`);
      }
      if (errors.plot?.message) {
        messages.push(`- 줄거리: ${errors.plot.message}`);
      }
      if (errors.characters?.message) {
        messages.push(`- 캐릭터: ${errors.characters.message}`);
      } else if (Array.isArray(errors.characters)) {
        errors.characters.forEach((charError, index) => {
          if (charError?.name?.message) {
            messages.push(`- 캐릭터 ${index + 1} 이름: ${charError.name.message}`);
          }
          if (charError?.description?.message) {
            messages.push(`- 캐릭터 ${index + 1} 설명: ${charError.description.message}`);
          }
        });
      }

      toast({
        title: "입력 양식을 확인해주세요",
        description: (
          <div className="text-left">
            {messages.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        ),
        variant: "destructive",
      });
      return;
    }

    setIsCapturing(true);
    
    try {
      // 폰트 로드 대기
      await document.fonts.ready;
      
      // Canvas를 사용한 안정적인 캡처
      const imageDataUrl = await captureWithCanvas();

      if (!imageDataUrl || imageDataUrl.length < 200 || !imageDataUrl.startsWith('data:image/png;base64,')) {
          console.error("캡처된 이미지 데이터가 유효하지 않음:", imageDataUrl.substring(0,100));
          throw new Error("캡처된 표지 이미지가 유효하지 않습니다. 다시 시도해주세요.");
      }
      
      setCapturedImageDataUrl(imageDataUrl);

      nextPage();

    } catch (error: unknown) {
      console.error("CharactorAndPlotDesign - 이미지 처리 중 오류:", error);
      const errorMessage = error instanceof Error ? error.message : TOAST_IMAGE_CAPTURE_ERROR_DESCRIPTION;
      toast({
        title: TOAST_IMAGE_CAPTURE_ERROR_TITLE,
        description: errorMessage,
        variant: "destructive",
      });
      return;
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="w-full p-4 pb-20 md:pb-4">
      {/* ... (rest of the form sections remain the same) ... */}
      <section className="mb-8 flex flex-col gap-4">
        <h2 className="text-xl font-semibold">세계관 제목</h2>
        <div className="relative">
          <Input
            type="text"
            maxLength={20}
            value={title}
            {...register("title")}
          />
        </div>
        <div className="flex flex-col gap-6">
          <CoverImageEditor />
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">줄거리</h2>
        <div className="relative">
          <textarea
            className="w-full p-3 border rounded-lg resize-none"
            rows={6}
            value={plot}
            onChange={(e) => setValue("plot", e.target.value)}
            placeholder="세계관의 전체적인 줄거리를 입력해주세요..."
          />
          <AiAssistButton
            targetField="plot"
            className="absolute bottom-2 right-1 bg-white border"
          />
        </div>
      </section>
      <section className="mb-8 relative">
        <h2 className="text-xl font-semibold mb-4">주요 등장인물</h2>
        <CharacterForm />
      </section>
      <section className="mb-8 relative">
        <h2 className="text-xl font-semibold mb-4">캐릭터 관계</h2>
        <p className="text-sm text-gray-500 mb-4">
          이 관계 설정은 독자에게 보이지 않으며, 작가님만 알 수 있는 숨은 설정입니다.
        </p>
        <RelationshipForm />
      </section>
      <button
        type="button"
        onClick={handleNext}
        disabled={isCapturing || !isCoverBgImageLoaded}
        className={`w-full bg-primary text-white py-3 rounded-lg ${isCapturing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isCoverBgImageLoaded ? "다음 단계로" : "표지 이미지 로딩 중..."}
      </button>
    </div>
  );
}