"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { OnboardingContextType } from "@/components/onboarding/types";
import { onboardingStorage } from "@/utils/onboarding/storage";
import { onboardingSteps } from "@/utils/onboarding/steps";

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSteps = onboardingSteps.length;

  useEffect(() => {
    const completed = onboardingStorage.isCompleted();
    setIsCompleted(completed);
    
    if (!completed) {
      setIsOpen(true);
    }
  }, []);

  const openOnboarding = useCallback(() => {
    setIsOpen(true);
    setCurrentStep(0);
  }, []);

  const closeOnboarding = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const completeOnboarding = useCallback(() => {
    onboardingStorage.markAsCompleted();
    setIsCompleted(true);
    setIsOpen(false);
  }, []);

  const canGoNext = useMemo(() => currentStep < totalSteps - 1, [currentStep, totalSteps]);
  const canGoPrevious = useMemo(() => currentStep > 0, [currentStep]);

  const value = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <OnboardingContext.Provider value={value}>
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
