"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [loadingCount, setLoadingCount] = useState(0);

  // useCallback으로 함수 재생성 방지
  const showLoading = useCallback(() => {
    setLoadingCount((prevCount) => prevCount + 1);
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  }, []);

  const isLoading = loadingCount > 0;

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}; 