"use client";

import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { useFormContext } from "react-hook-form";

const keywordOptions = [
  "로맨스",
  "로맨스판타지", 
  "학원물",
  "무협",
  "이세계",
  "게임판타지",
  "회귀",
  "빙의",
  "환생",
  "차원이동",
  "타임슬립",
  "서바이벌",
  "헌터",
  "게이트",
  "튜토리얼",
  "던전",
  "현대물",
  "시대물",
  "궁중물",
  "서양풍",
  "동양풍",
  "SF",
  "디스토피아",
  "가상현실",
  "성좌물",
  "좀비",
  "괴수",
  "마법",
  "제국",
  "기사단",
  "황실",
  "재벌가",
  "연예계",
  "아이돌",
  "오피스",
  "셀럽",
  "직장물",
  "의사물",
  "형사물",
  "법조물",
  "추리",
  "스릴러",
  "복수극",
  "정략결혼",
];

export function MoodSelector() {
  const { setValue, watch, formState } = useFormContext<CreateNovelForm>();
  const mood = watch("mood");

  const toggleKeyword = (selectedKeyword: string) => {
    if (mood.includes(selectedKeyword)) {
      setValue(
        "mood",
        mood.filter((m) => m !== selectedKeyword)
      );
    } else {
      if (mood.length >= 5) {
        return; // 최대 5개까지만 선택 가능
      }
      setValue("mood", [...mood, selectedKeyword]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">키워드 선택 (최대 5개)</h3>
      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
        {keywordOptions.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => toggleKeyword(option)}
            className={`p-2 rounded-lg border text-sm ${
              mood.includes(option)
                ? "bg-primary text-white"
                : "bg-white hover:bg-gray-50"
            } ${
              mood.length >= 5 && !mood.includes(option)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={mood.length >= 5 && !mood.includes(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        선택된 키워드: {mood.length}/5
      </p>
      <p className="text-destructive">{formState.errors.mood?.message}</p>
    </div>
  );
}
