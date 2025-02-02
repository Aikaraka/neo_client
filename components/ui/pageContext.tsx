"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

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
};
export const PageProvider = ({
  children,
  maxPage,
  initialPage,
}: PageProviderProps) => {
  const [currPage, setCurrPage] = useState(initialPage ?? 0);
  const navigation = useRouter();

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
      {currPage === maxPage && (
        <ChevronLeft
          className="absolute top-10 left-7 cursor-pointer z-50"
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
