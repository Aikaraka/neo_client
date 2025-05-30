"use client";
import { BackgroundForm } from "@/app/create/_components/BackgroundForm";
import { EndingSelector } from "@/app/create/_components/EndingSelector";
import { MoodSelector } from "@/app/create/_components/MoodSelector";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

export default function BackgroundSetting() {
  const { watch, setValue } = useFormContext<CreateNovelForm>();
  const hasViolence = watch("settings.hasViolence");
  const hasAdultContent = watch("settings.hasAdultContent");
  const isPublic = watch("settings.isPublic");

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">배경 설정</h1>
      <section className="space-y-8 mb-8">
        <BackgroundForm />
        <EndingSelector />
        <MoodSelector />
      </section>
      <div className="flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">유혈/폭력 묘사</label>
          <input
            type="checkbox"
            checked={hasViolence}
            onChange={(e) => setValue("settings.hasViolence", e.target.checked)}
            className="rounded border-gray-300"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">음란 묘사</label>
          <input
            type="checkbox"
            checked={hasAdultContent}
            onChange={(e) =>
              setValue("settings.hasAdultContent", e.target.checked)
            }
            className="rounded border-gray-300"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">공개 설정</label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setValue("settings.isPublic", e.target.checked)}
            className="rounded border-gray-300"
          />
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>※ 주의사항</p>
          <p>
            저작권, 실존 인물, 실존 건물과 같은 내용이 포함된 경우 삭제될 수
            있습니다.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-neo text-white py-3 rounded-lg p-6"
        >
          소설 생성하기
        </Button>
      </div>


    </div>
  );
}
