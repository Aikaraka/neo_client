import AiAssistButton from "@/app/create/_components/aiAssist";
import { CharacterForm } from "@/app/create/_components/CharacterForm";
import { RelationshipForm } from "@/app/create/_components/RelationshipForm";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { Input } from "@/components/ui/input";
import { usePageContext } from "@/components/ui/pageContext";
import { useToast } from "@/hooks/use-toast";
import { useFormContext } from "react-hook-form";

const TOAST_ERROR_TITLE = "양식 오류";
const TOAST_ERROR_DESCRIPTION = "형식에 맞게 설정해주세요!";
export default function CharactorAndPlotDesign() {
  const { toast } = useToast();
  const { nextPage } = usePageContext();
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
    const result = await Promise.all([
      trigger("characters"),
      trigger("plot"),
      trigger("title"),
    ]);
    const validity = result.every((v) => v);

    if (!validity) {
      toast({
        title: TOAST_ERROR_TITLE,
        description: TOAST_ERROR_DESCRIPTION,
        variant: "destructive",
      });
      return;
    }
    nextPage();
  };

  return (
    <div className="w-full p-4">
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
      </section>
      <section className="mb-8">
        <h2 className="text-xl mb-4">줄거리</h2>
        <div className="relative">
          <textarea
            className="w-full p-3 border rounded-lg pb-6"
            rows={6}
            value={plot}
            onChange={(e) => setValue("plot", e.target.value)}
            placeholder="소설의 전체적인 줄거리를 입력해주세요..."
          />
          <AiAssistButton
            targetField="plot"
            className="absolute bottom-2 right-2 hover:bg-transparent"
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
        type="submit"
        onClick={handleNext}
        className={`w-full bg-primary text-white py-3 rounded-lg`}
      >
        다음 단계로
      </button>
    </div>
  );
}
