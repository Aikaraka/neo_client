"use client";

import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

// 카테고리별로 키워드를 분류
const keywordCategories = {
  "장르": [
    "로맨스", "로맨스판타지", "무협", "이세계", "게임판타지", 
    "SF", "디스토피아", "가상현실", "성좌물", "좀비", "괴수"
  ],
  "설정": [
    "학원물", "현대물", "시대물", "궁중물", "서양풍", "동양풍",
    "재벌가", "연예계", "아이돌", "오피스", "셀럽", "직장물",
    "의사물", "형사물", "법조물"
  ],
  "스토리": [
    "회귀", "빙의", "환생", "차원이동", "타임슬립", "서바이벌",
    "헌터", "게이트", "튜토리얼", "던전", "복수극", "정략결혼"
  ],
  "배경": [
    "마법", "제국", "기사단", "황실"
  ]
};

// 인기 키워드 (자주 사용되는 키워드들)
const popularKeywords = [
  "로맨스", "이세계", "회귀", "헌터", "무협", "로맨스판타지", 
  "학원물", "현대물", "빙의", "환생", "스릴러", "판타지"
];

export function MoodSelector() {
  const { setValue, watch, formState } = useFormContext<CreateNovelForm>();
  const mood = watch("mood");
  const [activeCategory, setActiveCategory] = useState<string>("인기");
  const [showAll, setShowAll] = useState(false);

  const toggleMood = (selectedMood: string) => {
    if (mood.includes(selectedMood)) {
      setValue(
        "mood",
        mood.filter((m) => m !== selectedMood)
      );
    } else {
      if (mood.length >= 5) {
        return; // 최대 5개까지만 선택 가능
      }
      setValue("mood", [...mood, selectedMood]);
    }
  };

  const getCurrentKeywords = () => {
    if (activeCategory === "인기") {
      return popularKeywords;
    }
    return keywordCategories[activeCategory as keyof typeof keywordCategories] || [];
  };

  const displayKeywords = showAll ? getCurrentKeywords() : getCurrentKeywords().slice(0, 12);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">분위기/장르 선택 (최대 5개)</h3>
      
      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveCategory("인기")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === "인기"
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          🔥 인기
        </button>
        {Object.keys(keywordCategories).map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 선택된 키워드 표시 */}
      {mood.length > 0 && (
        <div className="p-3 bg-primary/5 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">선택된 키워드:</p>
          <div className="flex flex-wrap gap-1">
            {mood.map((selectedMood) => (
              <span
                key={selectedMood}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white rounded-full text-xs"
              >
                #{selectedMood}
                <button
                  type="button"
                  onClick={() => toggleMood(selectedMood)}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 키워드 선택 영역 */}
      <div className="grid grid-cols-3 gap-2">
        {displayKeywords.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => toggleMood(option)}
            className={`p-2 rounded-lg border transition-all text-sm ${
              mood.includes(option)
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300"
            } ${
              mood.length >= 5 && !mood.includes(option)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={mood.length >= 5 && !mood.includes(option)}
          >
            #{option}
          </button>
        ))}
      </div>

      {/* 더보기/접기 버튼 */}
      {getCurrentKeywords().length > 12 && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            {showAll ? "접기 ↑" : `더보기 (${getCurrentKeywords().length - 12}개 더) ↓`}
          </button>
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>선택된 키워드: {mood.length}/5</span>
        {mood.length >= 5 && (
          <span className="text-amber-600 font-medium">최대 개수에 도달했습니다</span>
        )}
      </div>
      
      <p className="text-destructive">{formState.errors.mood?.message}</p>
    </div>
  );
}
