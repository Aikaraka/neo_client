"use client";

import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { useFormContext } from "react-hook-form";

const moodOptions = [
  "로맨스",
  "코믹",
  "판타지",
  "SF",
  "액션",
  "호러",
  "범죄/스릴러",
  "추리",
  "무협",
  "스포츠",
  "역사",
  "힐링/일상",
  "디스토피아/아포칼립스",
  "초능력",
  "이세계",
  "성장물",
  "여성향",
  "남성향",
];

export function MoodSelector() {
  const { setValue, watch, formState } = useFormContext<CreateNovelForm>();
  const mood = watch("mood");

  const toggleMood = (selectedMood: string) => {
    if (mood.includes(selectedMood)) {
      setValue(
        "mood",
        mood.filter((m) => m !== selectedMood)
      );
    } else {
      if (mood.length >= 3) {
        return; // 최대 3개까지만 선택 가능
      }
      setValue("mood", [...mood, selectedMood]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">분위기 선택 (최대 3개)</h3>
      <div className="grid grid-cols-3 gap-2">
        {moodOptions.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => toggleMood(option)}
            className={`p-2 rounded-lg border ${
              mood.includes(option)
                ? "bg-primary text-white"
                : "bg-white hover:bg-gray-50"
            } ${
              mood.length >= 3 && !mood.includes(option)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={mood.length >= 3 && !mood.includes(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        선택된 분위기: {mood.length}/3
      </p>
      <p className="text-destructive">{formState.errors.mood?.message}</p>
    </div>
  );
}
