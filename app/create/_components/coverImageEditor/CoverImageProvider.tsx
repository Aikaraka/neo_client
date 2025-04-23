"use client";

import React, { createContext, useContext, useRef, useState } from "react";

type CoverImageContext = {
  coverImageRef: React.RefObject<HTMLDivElement>;
  imageSrc: string;
  changeImage: (src: string) => void;
  fontTheme: FontTheme;
  changeFontTheme: (font: FontTheme) => void;
};

const CoverImageContext = createContext<CoverImageContext | undefined>(
  undefined
);

const fontThemes = {
  sunset: "stroke-gradient sunset-gradient",
  ocean: "stroke-gradient ocean-gradient",
  pastel: "stroke-gradient pastel-gradient",
  rainbow: "stroke-gradient rainbow-gradient",
  fire: "stroke-gradient fire-gradient",
  black: "stroke-black", // fallback
} as const;
type FontTheme = keyof typeof fontThemes;

function CoverImageProvider({ children }: { children: React.ReactNode }) {
  const coverImageRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [fontTheme, setFont] = useState<FontTheme>("ocean");

  const changeImage = (src: string) => {
    setImageSrc(src);
  };

  const changeFontTheme = (font: FontTheme) => {
    if (font === font) return;
    setFont(font);
  };

  return (
    <CoverImageContext.Provider
      value={{
        coverImageRef,
        changeImage,
        imageSrc,
        changeFontTheme,
        fontTheme,
      }}
    >
      {children}
    </CoverImageContext.Provider>
  );
}
function useCoverImageContext() {
  const coverImageContext = useContext(CoverImageContext);
  if (!coverImageContext) {
    throw new Error(
      "useCoverImageContext must be used within a CoverImageProvider"
    );
  }
  return coverImageContext;
}
export { CoverImageProvider, useCoverImageContext, fontThemes };
export type { FontTheme };
