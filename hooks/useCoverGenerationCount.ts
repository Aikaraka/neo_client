import { useState } from 'react';

const MAX_COVER_GENERATIONS = 3;

export function useCoverGenerationCount() {
  const [remainingCount, setRemainingCount] = useState<number>(MAX_COVER_GENERATIONS);

  const decreaseCount = () => {
    if (remainingCount > 0) {
      const newRemaining = remainingCount - 1;
      setRemainingCount(newRemaining);
      return newRemaining;
    }
    return 0;
  };

  const resetCount = () => {
    setRemainingCount(MAX_COVER_GENERATIONS);
  };

  return {
    remainingCount,
    decreaseCount,
    resetCount,
    hasRemaining: remainingCount > 0
  };
} 