"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import PrevPageButton from "@/components/ui/PrevPageButton";
import { MoreHorizontal } from "lucide-react";
import { PointPopup } from "./PointPopup";
import React, { useRef, useState } from "react";

export default function ProgressRate() {
  const { progressRate, title } = useStoryContext();
  const [popupOpen, setPopupOpen] = useState(false);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="px-4 py-3 flex items-center justify-between relative">
      <PrevPageButton />

      <div className="flex-1 flex flex-col items-center">
        {/* 예: 소설 제목, 진행률 등 표시 */}
        <span className="font-medium text-sm">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">진행률</span>
          <div className="flex-1 flex items-center w-48">
            {/* 간단히 프로그레스바 대용 */}
            <div className="h-2 w-full bg-gray-200 relative rounded">
              <div
                className="h-2 bg-purple-400 rounded transition-all duration-700 ease-in-out"
                style={{ width: `${progressRate}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 ml-2">
              {progressRate}%
            </span>
          </div>
        </div>
      </div>

      {/* 점 세개(더보기) 아이콘 */}
      <button
        ref={moreBtnRef}
        className="text-gray-600 hover:text-black"
        onClick={() => setPopupOpen(true)}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      <PointPopup open={popupOpen} onClose={() => setPopupOpen(false)} anchorRef={moreBtnRef} />
    </div>
  );
}
