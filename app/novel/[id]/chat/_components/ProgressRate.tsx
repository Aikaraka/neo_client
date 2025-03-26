"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import PrevPageButton from "@/components/ui/PrevPageButton";
import { UndoIcon } from "lucide-react";

export function ProgressRate() {
  const { progressRate, title, undoStory } = useStoryContext();
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <PrevPageButton />

      <div className="flex-1 mx-3">
        {/* 예: 소설 제목, 진행률 등 표시 */}
        <div className="flex flex-col items-center">
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
      </div>

      <button onClick={undoStory} className="text-gray-600 hover:text-black">
        <UndoIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
