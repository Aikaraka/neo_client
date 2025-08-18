"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

export function NavigationControls({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  onComplete,
}: NavigationControlsProps) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between">
      {/* 이전 버튼 */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
          ${canGoPrevious 
            ? "text-purple-600 hover:bg-purple-50 hover:scale-105 hover:text-purple-700" 
            : "text-gray-300 cursor-not-allowed"
          }
        `}
      >
        <ChevronLeft size={20} />
        <span>이전</span>
      </button>

      {/* 진행 상태 인디케이터 */}
      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${index === currentStep 
                ? "bg-purple-500 scale-125" 
                : index < currentStep 
                  ? "bg-purple-300" 
                  : "bg-gray-200"
              }
            `}
          />
        ))}
      </div>

      {/* 다음/완료 버튼 */}
      <button
        onClick={isLastStep ? onComplete : onNext}
        disabled={!canGoNext && !isLastStep}
        className={`
          flex items-center space-x-2 px-6 py-3
          ${canGoNext || isLastStep 
            ? "bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-600 hover:via-purple-700 hover:to-indigo-700 hover:scale-105" 
            : "bg-gray-400 cursor-not-allowed"
          }
          text-white rounded-xl font-semibold text-sm
          transition-all duration-200
          shadow-lg shadow-purple-500/30
          tracking-wide
        `}
      >
        <span>{isLastStep ? "✨ 시작하기" : "다음"}</span>
        {!isLastStep && <ChevronRight size={20} />}
      </button>
    </div>
  );
}
