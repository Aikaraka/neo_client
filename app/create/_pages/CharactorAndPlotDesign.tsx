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
import * as htmlToImage from "html-to-image";
import { useState } from "react"; // Removed useEffect as it's not used here for now

const TOAST_ERROR_TITLE = "양식 오류";
const TOAST_ERROR_DESCRIPTION = "형식에 맞게 설정해주세요!";
const TOAST_IMAGE_REQUIRED_TITLE = "표지 이미지 필요";
const TOAST_IMAGE_REQUIRED_DESCRIPTION = "표지 이미지를 업로드하거나 AI로 생성해주세요.";
const TOAST_IMAGE_CAPTURE_ERROR_TITLE = "이미지 처리 오류";
const TOAST_IMAGE_CAPTURE_ERROR_DESCRIPTION = "표지 이미지 처리에 실패했습니다. 다시 시도해주세요.";
const TOAST_IMAGE_LOADING_TITLE = "이미지 로딩 중";
const TOAST_IMAGE_LOADING_DESCRIPTION = "표지 배경 이미지가 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.";


export default function CharactorAndPlotDesign() {
  const { toast } = useToast();
  const { nextPage, setCapturedImageDataUrl } = usePageContext();
  const { imageSrc, coverImageRef, isCoverBgImageLoaded } = useCoverImageContext();
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

  const handleNext = async () => {
    if (isCapturing) return;

    setDebugCapturedImage(null); // Clear previous debug image

    if (!imageSrc) {
      toast({
        title: TOAST_IMAGE_REQUIRED_TITLE,
        description: TOAST_IMAGE_REQUIRED_DESCRIPTION,
        variant: "destructive",
      });
      return;
    }

    if (!coverImageRef.current) {
      toast({
        title: TOAST_IMAGE_CAPTURE_ERROR_TITLE,
        description: "캡처할 표지 이미지 영역이 없습니다.",
        variant: "destructive",
      });
      return;
    }

    if (!isCoverBgImageLoaded) {
      toast({
        title: TOAST_IMAGE_LOADING_TITLE,
        description: TOAST_IMAGE_LOADING_DESCRIPTION,
        variant: "default",
      });
      return;
    }

    setIsCapturing(true);
    // No artificial delay for now, let's see the direct output first
    // await new Promise(resolve => setTimeout(resolve, 100)); 

    try {
      await document.fonts.ready;
      const imageDataUrl = await htmlToImage.toPng(coverImageRef.current, {
        width: 210,
        height: 270,
      });
      setCapturedImageDataUrl(imageDataUrl);
      const result = await Promise.all([
        trigger("title"),
        trigger("plot"),
        trigger("characters"),
      ]);
      const formValidity = result.every((v) => v);
      setIsCapturing(false);
      if (!formValidity) {
        toast({
          title: TOAST_ERROR_TITLE,
          description: TOAST_ERROR_DESCRIPTION,
          variant: "destructive",
        });
        return;
      }
      nextPage();
      setIsCapturing(false); // Reset here for now for debug purposes
      return; // IMPORTANT: Return here to prevent moving to next page, so user can see the debug image

    } catch (error: any) {
      console.error("CharactorAndPlotDesign - htmlToImage.toPng full error object:", error);
      if (error.message?.includes('tainted') || error.message?.includes('SecurityError') || error.name?.includes('SecurityError')) {
        console.error('Tainted canvas or SecurityError detected during htmlToImage capture:', error);
      }
      toast({
        title: TOAST_IMAGE_CAPTURE_ERROR_TITLE,
        description: TOAST_IMAGE_CAPTURE_ERROR_DESCRIPTION,
        variant: "destructive",
      });
      setIsCapturing(false);
      return;
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