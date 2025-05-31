"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

type PageContextType = {
  currPage: number;
  maxPage: number;
  nextPage: () => void;
  prevPage: () => void;
  prevButtonVisible: boolean;
  isLastStep: boolean;
  attemptedSubmit: boolean;
  setAttemptedSubmit: (attempted: boolean) => void;
  capturedImageFile: File | null;
  setCapturedImageFile: (file: File | null) => void;
  capturedImageDataUrl: string | null;
  setCapturedImageDataUrl: (dataUrl: string | null) => void;
};

const PageContext = createContext<PageContextType | undefined>(undefined);

type PageProviderProps = {
  children: React.ReactNode;
  maxPage: number;
  initialPage?: number;
  prevButton?: boolean;
};

export const PageProvider = ({
  children,
  maxPage,
  initialPage,
  prevButton = true,
}: PageProviderProps) => {
  const [currPage, setCurrPage] = useState(initialPage ?? 0);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [capturedImageFile, setCapturedImageFile] = useState<File | null>(null);
  const [capturedImageDataUrl, setCapturedImageDataUrl] = useState<string | null>(null);
  const navigation = useRouter();

  const prevButtonVisible = currPage > 0 && currPage <= maxPage && prevButton;
  const isLastStep = currPage === maxPage;

  function nextPage() {
    setAttemptedSubmit(false);
    setCurrPage((prev) => (prev < maxPage ? prev + 1 : prev));
  }

  function prevPage() {
    setAttemptedSubmit(false);
    if (!currPage) {
      navigation.back();
    } else {
      setCurrPage((prev) => prev - 1);
    }
  }

  return (
    <PageContext.Provider
      value={{
        currPage,
        maxPage,
        nextPage,
        prevPage,
        prevButtonVisible,
        isLastStep,
        attemptedSubmit,
        setAttemptedSubmit,
        capturedImageFile,
        setCapturedImageFile,
        capturedImageDataUrl,
        setCapturedImageDataUrl,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext는 PageProvider 내부에서 사용해야 합니다.");
  }
  return context;
};
