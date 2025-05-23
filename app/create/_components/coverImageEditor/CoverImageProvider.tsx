"use client";

import React, { createContext, useContext, useRef, useState } from "react";

type CoverImageContext = {
  coverImageRef: React.RefObject<HTMLDivElement>;
  imageSrc: string;
  changeImage: (src: string) => void;
  fontTheme: FontTheme;
  changeFontTheme: (targetFontTheme: FontTheme) => void;
  fontStyle: FontStyle;
  changeFontStyle: (targetFontStyle: FontStyle) => void;
};

const CoverImageContext = createContext<CoverImageContext | undefined>(
  undefined
);

const fontStyles = {
  봄바람체: "bombaram",
  "빛의 계승자체": "heiroOfLight",
} as const;
type FontStyle = keyof typeof fontStyles;

const fontThemes = {
  sunset: "stroke-gradient sunset-gradient",
  ocean: "stroke-gradient ocean-gradient",
  pastel: "stroke-gradient pastel-gradient",
  rainbow: "stroke-gradient rainbow-gradient",
  fire: "stroke-gradient fire-gradient",
  black: "stroke-gradient black-gradient",
} as const;
type FontTheme = keyof typeof fontThemes;

function CoverImageProvider({ children }: { children: React.ReactNode }) {
  const coverImageRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [fontTheme, setFont] = useState<FontTheme>("ocean");
  const [fontStyle, setFontStyle] = useState<FontStyle>("봄바람체");

  const changeImage = (src: string) => {
    setImageSrc(src);
  };

  const changeFontTheme = (targetFontTheme: FontTheme) => {
    if (fontTheme === targetFontTheme) return;
    setFont(targetFontTheme);
  };
  const changeFontStyle = (targetFontStyle: FontStyle) => {
    if (fontStyle === targetFontStyle) return;
    setFontStyle(targetFontStyle);
  };

  return (
    <CoverImageContext.Provider
      value={{
        coverImageRef,
        changeImage,
        imageSrc,
        changeFontTheme,
        fontTheme,
        fontStyle,
        changeFontStyle,
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
export { CoverImageProvider, useCoverImageContext, fontThemes, fontStyles };
export type { FontTheme };
