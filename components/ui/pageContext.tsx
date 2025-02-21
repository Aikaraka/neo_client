"use client";

import { cva, VariantProps } from "class-variance-authority";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

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
  const navigation = useRouter();

  const prevButtonVisible = currPage > 0 && currPage <= maxPage && prevButton;
  function nextPage() {
    setCurrPage((prev) => (prev < maxPage ? prev + 1 : prev));
  }

  function prevPage() {
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
      }}
    >
      {prevButtonVisible && (
        <ChevronLeft
          className={prevButtonVariants(variants)}
          size={32}
          onClick={prevPage}
        />
      )}
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
