"use client";

import React, { createContext, useContext, useRef, useState, useEffect } from "react";

type CoverImageContextType = {
  coverImageRef: React.RefObject<HTMLDivElement>;
  imageSrc: string; // For display (Data URL or object URL)
  imageFile: File | null; // The actual image file
  changeImage: (src: string, file?: File | null) => void; // Accept optional File object
  fontTheme: FontTheme;
  changeFontTheme: (targetFontTheme: FontTheme) => void;
  fontStyle: FontStyle;
  changeFontStyle: (targetFontStyle: FontStyle) => void;
  isImageManuallySet: boolean;
};

const CoverImageContext = createContext<CoverImageContextType | undefined>(
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
  const [imageFile, setImageFile] = useState<File | null>(null); // Add state for the image file
  const [fontTheme, setFontTheme] = useState<FontTheme>("ocean");
  const [fontStyle, setFontStyle] = useState<FontStyle>("봄바람체");
  const [isImageManuallySet, setIsImageManuallySet] = useState<boolean>(false);

  // 컴포넌트 언마운트 시 blob URL 해제
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]); // imageSrc가 변경될 때마다 이 effect의 cleanup 함수가 이전 URL을 해제하도록 함 (새 URL 생성 직후)

  const changeImage = (src: string, fileObject?: File | null) => {
    const newSrc = src || ""; // Ensure src is not null/undefined
    let displaySrc = newSrc;

    // If a file object is provided, prioritize it for the File state
    // and create an object URL for display if src is not already a data/http URL
    if (fileObject) {
      setImageFile(fileObject);
      // Check if the provided src is already a usable URL (data or http), otherwise create an object URL
      if (!newSrc.startsWith("data:") && !newSrc.startsWith("http")) {
         // Revoke previous object URL if it exists and a new file is being set
        if (imageSrc.startsWith("blob:") && imageFile) {
          URL.revokeObjectURL(imageSrc);
        }
        displaySrc = URL.createObjectURL(fileObject);
      }
    } else if (!newSrc) { // If src is empty (image removed)
      // Revoke previous object URL if it exists
      if (imageSrc.startsWith("blob:") && imageFile) {
        URL.revokeObjectURL(imageSrc);
      }
      setImageFile(null);
    }
    // If only src is provided (e.g., from AI generator, which gives a URL)
    // and it's different from the current imageFile's object URL
    else if (newSrc && !fileObject) {
        if (imageSrc.startsWith("blob:") && imageFile) {
          URL.revokeObjectURL(imageSrc);
        }
        setImageFile(null); // AI generated image, no local file
    }


    setImageSrc(displaySrc);

    if (displaySrc) {
      setIsImageManuallySet(true);
    } else {
      setIsImageManuallySet(false);
    }
  };

  const changeFontTheme = (targetFontTheme: FontTheme) => {
    if (fontTheme === targetFontTheme) return;
    setFontTheme(targetFontTheme);
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
        imageFile, // Provide imageFile in context
        changeFontTheme,
        fontTheme,
        fontStyle,
        changeFontStyle,
        isImageManuallySet,
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
export type { FontTheme, FontStyle }; // FontStyle도 export
