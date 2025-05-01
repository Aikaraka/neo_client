"use client";

import { BackgroundForm } from "@/app/create/_components/BackgroundForm";
import { EndingSelector } from "@/app/create/_components/EndingSelector";
import { MoodSelector } from "@/app/create/_components/MoodSelector";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { usePageContext } from "@/components/ui/pageContext";
import { useToast } from "@/hooks/use-toast";
import { useFormContext } from "react-hook-form";

const TOAST_TITLE_BACKGROUND_ERROR = "배경 설정 오류";
const TOAST_DESCRIPTION_BACKGROUND_ERROR =
  "배경 설정에 오류가 없는지 확인해주세요.";

export default function BackgroundSetting() {
  const { nextPage } = usePageContext();
  const { trigger } = useFormContext<CreateNovelForm>();
  const { toast } = useToast();

  const handleNext = async () => {
    const result = await Promise.all([
      trigger("background.start"),
      trigger("background.detailedLocations"),
      trigger("ending"),
      trigger("mood"),
    ]);
    if (!result.every((r) => r)) {
      toast({
        title: TOAST_TITLE_BACKGROUND_ERROR,
        description: TOAST_DESCRIPTION_BACKGROUND_ERROR,
      });
    } else {
      nextPage();
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">배경 설정</h1>
      <section className="space-y-8 mb-8">
        <BackgroundForm />
        <EndingSelector />
        <MoodSelector />
      </section>

      <button
        type="button"
        onClick={handleNext}
        className="w-full bg-primary text-white py-3 rounded-lg"
      >
        다음 단계로
      </button>
    </div>
  );
}
