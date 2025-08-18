"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { OnboardingContextType } from "@/components/onboarding/types";
import { onboardingStorage } from "@/utils/onboarding/storage";
import { onboardingSteps } from "@/utils/onboarding/steps";

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSteps = onboardingSteps.length;

  // 초기화: 완료 상태 확인 및 자동 오픈
  useEffect(() => {
    const completed = onboardingStorage.isCompleted();
    setIsCompleted(completed);
    
    // 완료되지 않은 경우 즉시 오픈
    if (!completed) {
      setIsOpen(true);
    }
  }, []);

  const openOnboarding = () => {
    setIsOpen(true);
    setCurrentStep(0);
  };

  const closeOnboarding = () => {
    setIsOpen(false);
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = () => {
    onboardingStorage.markAsCompleted();
    setIsCompleted(true);
    setIsOpen(false);
  };

  const canGoNext = currentStep < totalSteps - 1;
  const canGoPrevious = currentStep > 0;

  return (
    <OnboardingContext.Provider
      value={{
        isOpen,
        currentStep,
        totalSteps,
        isCompleted,
        openOnboarding,
        closeOnboarding,
        goToNextStep,
        goToPreviousStep,
        completeOnboarding,
        canGoNext,
        canGoPrevious,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
