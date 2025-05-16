"use client";

import React, { createContext, useContext, useRef, useState } from "react";

// "정상 작동 코드"에 명시된 타입명과 구조를 따릅니다.
type CoverImageContextValue = { 
  coverImageRef: React.RefObject<HTMLDivElement>;
  imageSrc: string;
  changeImage: (src: string) => void;
  fontTheme: FontTheme;
  changeFontTheme: (targetFontTheme: FontTheme) => void;
  fontStyle: FontStyle;
  changeFontStyle: (targetFontStyle: FontStyle) => void;
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
  // "정상 작동 코드"의 상태 변수명과 초기값을 따릅니다.
  const [fontTheme, setFontThemeState] = useState<FontTheme>("ocean"); 
  const [fontStyle, setFontStyleState] = useState<FontStyle>("봄바람체");

  const changeImage = (src: string) => {
    setImageSrc(src);
  };

  const changeFontTheme = (targetFontTheme: FontTheme) => {
    // "정상 작동 코드"의 로직을 따릅니다. (setFont -> setFontThemeState)
    if (fontTheme === targetFontTheme) return;
    setFontThemeState(targetFontTheme);
  };
  const changeFontStyle = (targetFontStyle: FontStyle) => {
    // "정상 작동 코드"의 로직을 따릅니다. (setFontStyle -> setFontStyleState)
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

// "정상 작동 코드"에서 export 했던 타입을 따릅니다.
export { CoverImageProvider, useCoverImageContext, fontThemes, fontStyles };
export type { FontTheme, FontStyle }; // FontStyle도 명시적으로 export (현행 유지)
