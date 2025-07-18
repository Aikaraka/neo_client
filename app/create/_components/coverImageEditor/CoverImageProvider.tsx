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
    // 이미지 유효성 검증
    if (!src) {
      console.warn("CoverImageProvider: changeImage called with empty source");
      return;
    }

    // 이미지 프리로드
    const preloadImage = new window.Image();
    preloadImage.crossOrigin = "anonymous";
    
    preloadImage.onload = () => {
      console.log("CoverImageProvider: Image preloaded successfully:", src.substring(0, 50));
      setImageSrc(src);
    };
    
    preloadImage.onerror = (error) => {
      console.error("CoverImageProvider: Image preload failed:", error);
      // Data URL인 경우 바로 설정 (프리로드 실패해도 사용 가능)
      if (src.startsWith('data:')) {
        setImageSrc(src);
      }
    };

    // Data URL인 경우 바로 src 설정, 그렇지 않은 경우 프리로드 시작
    if (src.startsWith('data:')) {
    setImageSrc(src);
      preloadImage.src = src; // 프리로드도 동시에 시작
    } else {
      preloadImage.src = src;
    }
    
    setIsCoverBgImageLoaded(false); // Reset on new image
    console.log("CoverImageProvider: changeImage - isCoverBgImageLoaded reset to false");
  };

  const changeFontTheme = (targetFontTheme: FontTheme) => {
    if (fontTheme === targetFontTheme) return;
    setFontThemeState(targetFontTheme);
  };

  const changeFontStyle = (targetFontStyle: FontStyle) => {
    console.log('CoverImageProvider: changeFontStyle 호출됨', {
      현재폰트: fontStyle,
      목표폰트: targetFontStyle,
      같은폰트여부: fontStyle === targetFontStyle
    });
    
    if (fontStyle === targetFontStyle) {
      console.log('CoverImageProvider: 같은 폰트라서 변경하지 않음');
      return;
    }
    
    console.log('CoverImageProvider: 폰트 변경 실행:', targetFontStyle);
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