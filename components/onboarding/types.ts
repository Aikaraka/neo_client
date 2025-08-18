export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
}

export interface OnboardingContextType {
  isOpen: boolean;
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  completeOnboarding: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}
