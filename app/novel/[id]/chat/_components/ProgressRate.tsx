"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import PrevPageButton from "@/components/ui/PrevPageButton";
import { MoreHorizontal } from "lucide-react";
import { MoreMenu } from "./MoreMenu";
import React from "react";

interface ProgressRateProps {
  onShowImageArchive: () => void;
  onColorChange?: (color: string) => void;
  selectedColor: string;
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
  paragraphWidth: number;
  onFontSizeChange: (size: number) => void;
  onLineHeightChange: (lh: number) => void;
  onParagraphSpacingChange: (ps: number) => void;
  onParagraphWidthChange: (width: number) => void;
  brightness: number;
  onBrightnessChange: (brightness: number) => void;
  font: string;
  onFontChange: (font: string) => void;
}

export default function ProgressRate({
  onShowImageArchive,
  onColorChange,
  selectedColor,
  fontSize,
  lineHeight,
  paragraphSpacing,
  paragraphWidth,
  onFontSizeChange,
  onLineHeightChange,
  onParagraphSpacingChange,
  onParagraphWidthChange,
  brightness,
  onBrightnessChange,
  font,
  onFontChange,
}: ProgressRateProps) {
  const { progressRate, title } = useStoryContext();

  return (
    <div className="px-4 py-3 flex items-center justify-between relative">
      <div className="w-10">
        <PrevPageButton />
      </div>

      <div className="flex-1 flex flex-col items-center text-center">
        {/* 예: 소설 제목, 진행률 등 표시 */}
        <span className="font-medium text-sm truncate w-48">{title}</span>
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

      {/* 오른쪽 아이콘 그룹 */}
      <div className="w-10 flex justify-end">
        <MoreMenu
          onShowImageArchive={onShowImageArchive}
          onColorChange={onColorChange}
          selectedColor={selectedColor}
          fontSize={fontSize}
          lineHeight={lineHeight}
          paragraphSpacing={paragraphSpacing}
          paragraphWidth={paragraphWidth}
          onFontSizeChange={onFontSizeChange}
          onLineHeightChange={onLineHeightChange}
          onParagraphSpacingChange={onParagraphSpacingChange}
          onParagraphWidthChange={onParagraphWidthChange}
          brightness={brightness}
          onBrightnessChange={onBrightnessChange}
          font={font}
          onFontChange={onFontChange}
        >
          <button className="text-gray-600 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </MoreMenu>
      </div>
    </div>
  );
}
