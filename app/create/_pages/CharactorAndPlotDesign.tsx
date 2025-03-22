import { CharacterForm } from "@/app/create/_components/CharacterForm";
import { RelationshipForm } from "@/app/create/_components/RelationshipForm";
import { getAIAssist } from "@/app/create/_api/aiAssist.server";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { Input } from "@/components/ui/input";
import { usePageContext } from "@/components/ui/pageContext";
import { useToast } from "@/hooks/use-toast";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

const TOAST_ERROR_TITLE = "양식 오류";
const TOAST_ERROR_DESCRIPTION = "형식에 맞게 설정해주세요!";

export default function CharactorAndPlotDesign() {
  const { toast } = useToast();
  const { nextPage } = usePageContext();
  const [isAILoading, setIsAILoading] = useState(false);
  const {
    formState: { errors },
    trigger,
    setValue,
    watch,
    getValues,
  } = useFormContext<CreateNovelForm>();

  const plot = watch("plot") ?? "";
  const title = watch("title") ?? "";

  const handleAIAssist = async (field: "plot" | "characters" | "relationships") => {
    try {
      setIsAILoading(true);
      const formData = getValues();
      const response = await getAIAssist({
        formData,
        targetField: field,
      });

      if (field === "plot") {
        setValue(field, response.content);
      } else if (field === "characters") {
        // TODO: 캐릭터 AI 어시스트 구현
        console.log("Character AI assist not implemented yet");
      } else if (field === "relationships") {
        // TODO: 관계 AI 어시스트 구현
        console.log("Relationship AI assist not implemented yet");
      }
    } catch (error) {
      toast({
        title: "AI 어시스트 오류",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsAILoading(false);
    }
  };

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
    <div className="container p-4">
      <section className="mb-8 flex flex-col gap-4">
        <h2 className="text-xl ">소설 제목</h2>
        <div>
          <Input
            type="text"
            maxLength={20}
            value={title}
            onChange={(e) => setValue("title", e.target.value)}
          />
          <p className="text-destructive">{errors.title?.message}</p>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl mb-4">줄거리</h2>
        <div className="relative">
          <textarea
            className="w-full p-3 border rounded-lg"
            rows={6}
            value={plot}
            onChange={(e) => setValue("plot", e.target.value)}
            placeholder="소설의 전체적인 줄거리를 입력해주세요..."
          />
          <button
            type="button"
            className="ai-plot-assist absolute right-2 top-2"
            onClick={() => handleAIAssist("plot")}
            disabled={isAILoading}
          >
            {isAILoading ? "생성 중..." : "AI"}
          </button>
        </div>
        <p className="text-destructive">{errors.plot?.message}</p>
      </section>

      <section className="mb-8 relative">
        <h2 className="text-xl mb-4">주요 등장인물</h2>
        <CharacterForm />
        <p>{errors.characters?.[0]?.message}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl mb-4">캐릭터 관계</h2>
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
