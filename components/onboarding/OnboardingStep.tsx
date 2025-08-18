"use client";

import React from "react";
import { onboardingSteps } from "@/utils/onboarding/steps";

interface OnboardingStepProps {
  stepIndex: number;
  direction?: "next" | "previous" | null;
}

export function OnboardingStep({ stepIndex, direction }: OnboardingStepProps) {
  const step = onboardingSteps[stepIndex];

  if (!step) {
    return null;
  }

  return (
    <div
      className={`
        w-full transition-all duration-300 ease-out
        ${direction === "next" ? "animate-slideInRight" : ""}
        ${direction === "previous" ? "animate-slideInLeft" : ""}
      `}
    >
      {/* 스텝 컨텐츠 */}
      <div className="text-center space-y-4">
        {/* 메인 비주얼 컨텐츠 */}
        <div className="mb-4">
          {step.content}
        </div>

        {/* 제목 */}
        <h2 className="
          text-lg md:text-xl font-bold 
          text-white
          leading-tight
          px-3
          tracking-tight
          drop-shadow-lg
        ">
          {step.title}
        </h2>

        {/* 설명 */}
        <div className="
          text-white/90 text-xs md:text-sm 
          leading-relaxed
          max-w-xl mx-auto
          px-4
          font-medium
          drop-shadow-md
        ">
          {step.description.split('\n').map((line, index) => (
            <p key={index} className={index > 0 ? "mt-2" : ""}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tailwind CSS 애니메이션 클래스를 위한 스타일
// globals.css에 추가할 애니메이션
export const stepAnimationStyles = `
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideInRight {
  animation: slideInRight 0.3s ease-out;
}

.animate-slideInLeft {
  animation: slideInLeft 0.3s ease-out;
}
`;
