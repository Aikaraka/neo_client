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

const MAX_IMAGE_LOAD_ATTEMPTS = 30; // 최대 30번 시도 (30 * 100ms = 3초)
const IMAGE_LOAD_POLL_INTERVAL = 100; // 100ms 간격으로 확인

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

  const waitForImageToLoad = (imgElement: HTMLImageElement): Promise<void> => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const checkImage = () => {
        if (imgElement.complete && imgElement.naturalWidth > 0 && imgElement.naturalHeight > 0) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve()); // 2 프레임 대기
          });
        } else if (attempts < MAX_IMAGE_LOAD_ATTEMPTS) {
          attempts++;
          setTimeout(checkImage, IMAGE_LOAD_POLL_INTERVAL);
        } else {
          reject(new Error("캡처 전 이미지 로드 타임아웃. 이미지가 너무 크거나 네트워크 상태를 확인해주세요."));
        }
      };
      checkImage();
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

    const editorElement = coverImageRef.current;
    if (!editorElement) {
      toast({ title: TOAST_IMAGE_CAPTURE_ERROR_TITLE, description: "캡처할 표지 이미지 영역(editorElement)이 없습니다.", variant: "destructive" });
      return;
    }

    const imgElement = editorElement.querySelector('img');
    if (!imgElement) {
      // 이 시점에 imgElement가 없을 경우, isCoverBgImageLoaded를 다시 체크하거나,
      // CoverImageEditor 내부 렌더링 로직 문제일 수 있음.
      // 또는 imageSrc는 있지만 아직 img 태그가 DOM에 반영되지 않은 극단적 타이밍 문제.
      // isCoverBgImageLoaded가 true여도 imgElement가 없을 수 있음을 인지.
      if (!isCoverBgImageLoaded) { // isCoverBgImageLoaded가 false면 아직 로드 시도 전/중이므로 대기 유도
         toast({
            title: TOAST_IMAGE_LOADING_TITLE,
            description: TOAST_IMAGE_LOADING_DESCRIPTION,
            variant: "default",
         });
      } else { // isCoverBgImageLoaded가 true인데도 img 태그가 없다면 다른 문제
         toast({ title: TOAST_IMAGE_CAPTURE_ERROR_TITLE, description: "캡처할 표지 이미지 DOM(imgElement)을 찾을 수 없습니다. 이미지 로드 상태를 확인해주세요.", variant: "destructive" });
      }
      return;
    }
    
    // isCoverBgImageLoaded 상태는 참고용으로 두고, 실제 imgElement의 상태를 우선시
    // if (!isCoverBgImageLoaded) { // 이 조건은 waitForImageToLoad 로직으로 대체 가능
    //   toast({
    //     title: TOAST_IMAGE_LOADING_TITLE,
    //     description: TOAST_IMAGE_LOADING_DESCRIPTION,
    //     variant: "default",
    //   });
    //   return;
    // }

    setIsCapturing(true);
    
    try {
      await document.fonts.ready; 
      
      console.log('캡처 대상 DOM:', editorElement);
      console.log('캡처 대상 이미지 소스 (img.src):', imgElement.src);
      console.log('이미지 로드 상태 (img.complete):', imgElement.complete, ' (naturalWidth):', imgElement.naturalWidth);

      await waitForImageToLoad(imgElement);
      console.log('이미지 최종 로드 및 렌더링 확인됨');

      const imageDataUrl = await htmlToImage.toPng(editorElement, {
        width: 210,
        height: 270,
        cacheBust: true, 
      });

      console.log('캡처된 imageDataUrl 길이:', imageDataUrl.length);
      if (!imageDataUrl || imageDataUrl.length < 200 || !imageDataUrl.startsWith('data:image/png;base64,')) { // 길이 임계값 조정
          console.error("캡처된 이미지 데이터가 유효하지 않음:", imageDataUrl.substring(0,100));
          throw new Error("캡처된 표지 이미지가 유효하지 않습니다. 다시 시도해주세요.");
      }
      
      setCapturedImageDataUrl(imageDataUrl);
      // setDebugCapturedImage(imageDataUrl); // 디버깅 시 캡처된 이미지 표시

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
        // setIsCapturing(false); // finally에서 처리
        return;
      }
      nextPage();
      // setIsCapturing(false); // finally에서 처리, 성공 후에도 false로.
      // return; // 더 이상 디버그용 return 불필요

    } catch (error: any) {
      console.error("CharactorAndPlotDesign - htmlToImage 처리 중 오류:", error);
      toast({
        title: TOAST_IMAGE_CAPTURE_ERROR_TITLE,
        description: error.message || TOAST_IMAGE_CAPTURE_ERROR_DESCRIPTION,
        variant: "destructive",
      });
      // setIsCapturing(false); // finally에서 처리
      return; // 오류 발생 시 nextPage() 호출 방지
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