"use client";

import React, { createContext, useContext, useRef, useState } from "react";

type CoverImageContextValue = {
  coverImageRef: React.RefObject<HTMLDivElement>;
  imageSrc: string;
  changeImage: (src: string) => void;
  fontTheme: FontTheme;
  changeFontTheme: (targetFontTheme: FontTheme) => void;
  fontStyle: FontStyle;
  changeFontStyle: (targetFontStyle: FontStyle) => void;
  isCoverBgImageLoaded: boolean; // Added
  setCoverBgImageLoaded: (isLoaded: boolean) => void; // Added
};

const CoverImageContext = createContext<CoverImageContextValue | undefined>(
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
  const [fontTheme, setFontThemeState] = useState<FontTheme>("ocean");
  const [fontStyle, setFontStyleState] = useState<FontStyle>("봄바람체");
  const [isCoverBgImageLoaded, setIsCoverBgImageLoaded] = useState(false); // Added

  // Wrapped setter for logging
  const newSetIsCoverBgImageLoaded = (isLoaded: boolean) => {
    console.log("CoverImageProvider: setCoverBgImageLoaded called with:", isLoaded);
    setIsCoverBgImageLoaded(isLoaded);
  };

  const changeImage = (src: string) => {
    setImageSrc(src);
    setIsCoverBgImageLoaded(false); // Reset on new image
    console.log("CoverImageProvider: changeImage - isCoverBgImageLoaded reset to false"); // Added log
  };

  const changeFontTheme = (targetFontTheme: FontTheme) => {
    if (fontTheme === targetFontTheme) return;
    setFontThemeState(targetFontTheme);
  };

  const changeFontStyle = (targetFontStyle: FontStyle) => {
    if (fontStyle === targetFontStyle) return;
    setFontStyleState(targetFontStyle);
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
        isCoverBgImageLoaded, // Added
        setCoverBgImageLoaded: newSetIsCoverBgImageLoaded, // Changed to wrapped setter
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
export type { FontTheme, FontStyle };