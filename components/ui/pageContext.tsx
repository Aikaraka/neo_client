"use client";

import { cva, VariantProps } from "class-variance-authority";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const prevButtonVariants = cva("absolute cursor-pointer z-50", {
  variants: {
    variant: {
      default: "top-10 left-7",
      header: "top-4 left-4",
    },
  },
});

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
  variants?: VariantProps<typeof prevButtonVariants>;
};

export const PageProvider = ({
  children,
  maxPage,
  initialPage,
  prevButton = true,
  variants = { variant: "default" },
}: PageProviderProps) => {
  const [currPage, setCurrPage] = useState(initialPage ?? 0);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [capturedImageFile, setCapturedImageFile] = useState<File | null>(null);
  const [capturedImageDataUrl, setCapturedImageDataUrl] = useState<string | null>(
    () => (typeof window !== "undefined" ? sessionStorage.getItem("capturedImageDataUrl") : null)
  );
  const navigation = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (capturedImageDataUrl) {
      sessionStorage.setItem("capturedImageDataUrl", capturedImageDataUrl);
    } else {
      sessionStorage.removeItem("capturedImageDataUrl");
    }
  }, [capturedImageDataUrl]);

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
