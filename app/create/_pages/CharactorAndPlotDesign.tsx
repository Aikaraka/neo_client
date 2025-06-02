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

const TOAST_ERROR_TITLE = "양식 오류";
const TOAST_ERROR_DESCRIPTION = "형식에 맞게 설정해주세요!";
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
  const [debugCapturedImage, setDebugCapturedImage] = useState<string | null>(null); // For displaying the captured image

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

      // Canvas 생성 (고해상도)
      const canvas = document.createElement('canvas');
      const scale = 3; // 화질 개선을 위한 스케일
      canvas.width = 210 * scale;
      canvas.height = 270 * scale;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error("Canvas context를 생성할 수 없습니다."));
        return;
      }

      // 고해상도 렌더링을 위한 스케일 적용
      ctx.scale(scale, scale);

      // 배경 이미지 그리기
      if (imageSrc) {
        const bgImage = new window.Image();
        bgImage.crossOrigin = 'anonymous';
        
        bgImage.onload = () => {
          // 배경 이미지 그리기
          ctx.drawImage(bgImage, 0, 0, 210, 270);
          
          // 제목 텍스트 그리기
          const titleElement = editorElement.querySelector('.text-box');
          if (titleElement) {
            const computedStyle = window.getComputedStyle(titleElement);
            const fontSize = parseInt(computedStyle.fontSize);
            const fontFamily = computedStyle.fontFamily;
            
            // 텍스트 위치 계산
            const rect = titleElement.getBoundingClientRect();
            const editorRect = editorElement.getBoundingClientRect();
            const x = rect.left - editorRect.left;
            const y = rect.top - editorRect.top + fontSize;
            
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
            
            // 텍스트 자동 줄바꿈 (표지 너비에 맞게)
            const maxTextWidth = 180; // 표지 너비에서 여백 제외
            const lines = wrapText(titleText, maxTextWidth);
            const lineHeight = fontSize * 1.2;
            
            // 그라디언트 테두리
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 8;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            
            lines.forEach((line, index) => {
              ctx.strokeText(line, x, y + (index * lineHeight));
            });
            
            // 메인 텍스트 (흰색)
            ctx.fillStyle = 'white';
            
            lines.forEach((line, index) => {
              ctx.fillText(line, x, y + (index * lineHeight));
            });
          }
          
          // Canvas를 Data URL로 변환 (고해상도)
          resolve(canvas.toDataURL('image/png', 1.0));
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

    setDebugCapturedImage(null); 

    if (!imageSrc) {
      toast({
        title: TOAST_IMAGE_REQUIRED_TITLE,
        description: TOAST_IMAGE_REQUIRED_DESCRIPTION,
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

      console.log('캡처된 imageDataUrl 길이:', imageDataUrl.length);
      if (!imageDataUrl || imageDataUrl.length < 200 || !imageDataUrl.startsWith('data:image/png;base64,')) {
          console.error("캡처된 이미지 데이터가 유효하지 않음:", imageDataUrl.substring(0,100));
          throw new Error("캡처된 표지 이미지가 유효하지 않습니다. 다시 시도해주세요.");
      }
      
      setCapturedImageDataUrl(imageDataUrl);
      setDebugCapturedImage(imageDataUrl); // 디버깅 시 캡처된 이미지 표시

      const result = await Promise.all([
        trigger("title"),
        trigger("plot"),
        trigger("characters"),
      ]);
      const formValidity = result.every((v) => v);
      
      if (!formValidity) {
        toast({
          title: TOAST_ERROR_TITLE,
          description: TOAST_ERROR_DESCRIPTION,
          variant: "destructive",
        });
        return;
      }
      nextPage();

    } catch (error: any) {
      console.error("CharactorAndPlotDesign - 이미지 처리 중 오류:", error);
      toast({
        title: TOAST_IMAGE_CAPTURE_ERROR_TITLE,
        description: error.message || TOAST_IMAGE_CAPTURE_ERROR_DESCRIPTION,
        variant: "destructive",
      });
      return;
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="w-full p-4">
      {/* ... (rest of the form sections remain the same) ... */}
      <section className="mb-8 flex flex-col gap-4">
        <h2 className="text-xl ">소설 제목</h2>
        <div className="relative">
          <Input
            type="text"
            maxLength={20}
            value={title}
            {...register("title")}
          />
          <p className="text-destructive">{errors.title?.message}</p>
        </div>
        <div className="flex flex-col gap-6">
          <CoverImageEditor />
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl mb-4">줄거리</h2>
        <div className="relative">
          <textarea
            className="w-full p-3 border rounded-lg resize-none"
            rows={6}
            value={plot}
            onChange={(e) => setValue("plot", e.target.value)}
            placeholder="소설의 전체적인 줄거리를 입력해주세요..."
          />
          <AiAssistButton
            targetField="plot"
            className="absolute bottom-2 right-1 bg-white border"
          />
        </div>
        <p className="text-destructive">{errors.plot?.message}</p>
      </section>
      <section className="mb-8 relative">
        <h2 className="text-xl mb-4">주요 등장인물</h2>
        <CharacterForm />
        <p>{errors.characters?.[0]?.message}</p>
      </section>
      <section className="mb-8 relative">
        <h2 className="text-xl  mb-4">캐릭터 관계</h2>
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

      {/* Debug Image Display Section */}
      {debugCapturedImage && (
        <div className="mt-4 p-4 border border-dashed border-red-500">
          <h3 className="text-lg font-semibold text-red-500">디버그: 캡처된 이미지 미리보기</h3>
          <img src={debugCapturedImage} alt="Debug - Captured Cover Snapshot" style={{ border: '2px solid red', width: '210px', height: '270px', objectFit: 'contain' }} />
          <p className="text-sm text-gray-600 mt-2">이 이미지가 실제 캡처된 결과입니다. 배경 이미지가 누락되었는지 확인해주세요.</p>
        </div>
      )}

    </div>
  );
}