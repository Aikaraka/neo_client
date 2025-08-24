"use client";

import React, { useState, useEffect } from "react";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { GlassBrowserFrame } from "./GlassBrowserFrame";
import { OnboardingStep } from "./OnboardingStep";
import { NavigationControls } from "./NavigationControls";

type Direction = "next" | "previous" | null;

export function OnboardingModal() {
  const {
    isOpen,
    currentStep,
    totalSteps,
    closeOnboarding,
    goToNextStep,
    goToPreviousStep,
    completeOnboarding,
    canGoNext,
    canGoPrevious,
  } = useOnboarding();

  const [direction, setDirection] = useState<Direction>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 모달 오픈 애니메이션
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  // 모달 닫기 애니메이션
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      closeOnboarding();
    }, 300);
  };

  const handleNext = () => {
    setDirection("next");
    setTimeout(() => {
      goToNextStep();
      setDirection(null);
    }, 50);
  };

  const handlePrevious = () => {
    setDirection("previous");
    setTimeout(() => {
      goToPreviousStep();
      setDirection(null);
    }, 50);
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      completeOnboarding();
    }, 300);
  };

  // 스와이프 제스처 지원
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && canGoNext) {
      handleNext();
    }
    if (isRightSwipe && canGoPrevious) {
      handlePrevious();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] 
        flex items-center justify-center p-4
        transition-all duration-300 ease-out
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
    >
      {/* 배경 클릭으로 닫기 */}
      <div 
        className="absolute inset-0" 
        onClick={handleClose}
      />
      
      {/* 메인 모달 컨텐츠 */}
      <div
        className={`
          relative w-full max-w-4xl mx-auto
          h-[80vh] max-h-[600px]
          transform transition-all duration-300 ease-out
          ${isVisible ? "translate-y-0" : "translate-y-8"}
        `}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >

        {/* Glass 브라우저 프레임 */}
        <GlassBrowserFrame>
          <div className="space-y-4 w-full">
            {/* 스텝 컨텐츠 */}
            <OnboardingStep 
              stepIndex={currentStep} 
              direction={direction}
            />

            {/* 네비게이션 컨트롤 */}
            <NavigationControls
              currentStep={currentStep}
              totalSteps={totalSteps}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onComplete={handleComplete}
            />
          </div>
        </GlassBrowserFrame>
      </div>


    </div>
  );
}
