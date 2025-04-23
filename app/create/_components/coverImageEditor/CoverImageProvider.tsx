"use client";

import React, { createContext, useContext, useRef, useState } from "react";

type CoverImageContext = {
  coverImageRef: React.RefObject<HTMLDivElement>;
  imageSrc: string;
  changeImage: (src: string) => void;
  fontTheme: FontTheme;
  changeFontTheme: (font: FontTheme) => void;
  fontStyle: FontStyle;
  changeFontStyle: (font: FontStyle) => void;
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
  black: "stroke-black",
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

  const changeFontTheme = (font: FontTheme) => {
    if (font === font) return;
    setFont(font);
  };
  const changeFontStyle = (fontStyle: FontStyle) => {
    if (fontStyle === fontStyle) return;
    setFontStyle(fontStyle);
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
