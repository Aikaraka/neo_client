import AiAssistButton from "@/app/create/_components/aiAssist";
import CoverImageEditor from "@/app/create/_components/coverImageEditor/CoverImageEditor";
import { CharacterForm } from "@/app/create/_components/CharacterForm";
import { RelationshipForm } from "@/app/create/_components/RelationshipForm";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { usePageContext } from "@/components/ui/pageContext";
import { useToast } from "@/hooks/use-toast";
import { useFormContext } from "react-hook-form";
import { useCoverImageContext } from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import * as htmlToImage from "html-to-image";

const TOAST_ERROR_TITLE = "양식 오류";
const TOAST_ERROR_DESCRIPTION = "형식에 맞게 설정해주세요!";
const TOAST_IMAGE_REQUIRED_TITLE = "표지 이미지 필요";
const TOAST_IMAGE_REQUIRED_DESCRIPTION = "표지 이미지를 업로드하거나 AI로 생성해주세요.";
const TOAST_IMAGE_CAPTURE_ERROR_TITLE = "이미지 처리 오류";
const TOAST_IMAGE_CAPTURE_ERROR_DESCRIPTION = "표지 이미지 처리에 실패했습니다. 다시 시도해주세요.";

export default function CharactorAndPlotDesign() {
  const { toast } = useToast();
  const { nextPage, setCapturedImageDataUrl } = usePageContext();
  const { imageSrc, coverImageRef } = useCoverImageContext();
  const {
    formState: { errors },
    trigger,
    setValue,
    watch,
    register,
  } = useFormContext<CreateNovelForm>();

  const plot = watch("plot");
  const title = watch("title");

  const handleNext = async () => {
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

    try {
      const imageDataUrl = await htmlToImage.toPng(coverImageRef.current, {
        width: 210,
        height: 270,
      });
      setCapturedImageDataUrl(imageDataUrl);
    } catch (error) {
      console.error("표지 이미지 캡처 중 에러:", error);
      toast({
        title: TOAST_IMAGE_CAPTURE_ERROR_TITLE,
        description: TOAST_IMAGE_CAPTURE_ERROR_DESCRIPTION,
        variant: "destructive",
      });
      return;
    }

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

    // setCapturedImageFile(imageFile);

    nextPage();
  };

  return (
    <div className="w-full p-4">
      <section className="mb-8 flex flex-col gap-4">
        <h2 className="text-xl ">소설 제목</h2>
        <CoverImageEditor />
        <input type="hidden" value={title} {...register("title")}/>
        <p className="text-destructive">{errors.title?.message}</p>
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
        className={`w-full bg-primary text-white py-3 rounded-lg`}
      >
        다음 단계로
      </button>
    </div>
  );
}
