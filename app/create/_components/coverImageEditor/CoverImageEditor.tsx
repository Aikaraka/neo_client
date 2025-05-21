"use client";

import CoverImageGenerator from "@/app/create/_components/coverImageEditor/CoverImageGenerator";
import {
  fontStyles,
  fontThemes,
  useCoverImageContext,
} from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import { CoverImageUploader } from "@/app/create/_components/coverImageEditor/CoverImageUploader";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Rnd } from "react-rnd";

export default function CoverImageEditor() {
  const { coverImageRef, imageSrc } = useCoverImageContext();

  return (
    <>
      <div
        id="cover-image-editor"
        ref={coverImageRef}
        className="border w-[210px] h-[270px] self-center relative"
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            alt="novel cover Image"
            width={210}
            height={270}
            className="w-full h-full object-fill"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            unoptimized
            crossOrigin="anonymous"
          />
        )}
        <TextEdit />
      </div>
      <ColorSelect />
      <FontSelect />
      <CoverImageUploader />
      <CoverImageGenerator />
    </>
  );
}

const DEFAULT_WIDTH = 200,
  DEFAULT_HEIGHT = 100;
const BASE_FONT_SIZE = 28;

function TextEdit() {
  const { getValues } = useFormContext<CreateNovelForm>();
  const title = getValues("title");
  const { fontTheme, fontStyle } = useCoverImageContext();
  const [size, setSize] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const [showEditMode, setShowEditMode] = useState(true);

  const dynamicFontSize = (size.width / DEFAULT_WIDTH) * BASE_FONT_SIZE;
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickTextzone(event: MouseEvent) {
      if (wrapperRef.current) {
        wrapperRef.current.contains(event.target as Node)
          ? setShowEditMode(true)
          : setShowEditMode(false);
      }
    }

    document.addEventListener("click", handleClickTextzone);
    return () => {
      document.removeEventListener("click", handleClickTextzone);
    };
  }, []);

  return (
    <Rnd
      default={{
        x: 0,
        y: 100,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      }}
      bounds="parent"
      enableResizing={{
        bottomRight: true,
        right: true,
        bottom: true,
        top: true,
        left: true,
        topRight: true,
      }}
      onResize={(_, __, ref) => {
        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
      resizeHandleComponent={{
        bottomRight: (
          <ResizeHandle
            className="translate-y-1 translate-x-1"
            visible={showEditMode}
          />
        ),
        topRight: (
          <ResizeHandle
            className="translate-y-1 translate-x-1"
            visible={showEditMode}
          />
        ),
        bottom: (
          <ResizeHandle className="-translate-x-1" visible={showEditMode} />
        ),
        top: <ResizeHandle className="-translate-x-1" visible={showEditMode} />,
      }}
      dragHandleClassName="text-box"
      className={`absolute text-black text-2xl font-bold  cursor-pointer z-10  p-1 ${
        showEditMode ? "border border-primary" : ""
      }`}
    >
      <div ref={wrapperRef}>
        <div
          className={`text-box w-full h-full break-words overflow-visible cursor-pointer text-transparent text-[28px] leading-[31px]  font-bold tracking-wider ${fontThemes[fontTheme]} scrollbar-hidden relative`}
          style={{
            fontFamily: fontStyles[fontStyle],
            fontSize: `${dynamicFontSize}px`,
          }}
        >
          {title}
        </div>
      </div>
    </Rnd>
  );
}

function ColorSelect() {
  const { changeFontTheme } = useCoverImageContext();
  return (
    <div className="flex gap-2 self-center">
      {Object.keys(fontThemes).map((color) => (
        <Button
          key={`color-${color}`}
          type="button"
          variant="outline"
          className={`bg-${
            fontThemes[color as keyof typeof fontThemes]
          } rounded-full w-5 h-5`}
          onClick={() => changeFontTheme(color as keyof typeof fontThemes)}
        ></Button>
      ))}
    </div>
  );
}

function FontSelect() {
  const { changeFontStyle, fontStyle } = useCoverImageContext();
  return (
    <div className="flex gap-2 self-center">
      {Object.keys(fontStyles).map((font) => (
        <Button
          key={`font-${font}`}
          type="button"
          style={{ fontFamily: fontStyles[fontStyle] }}
          variant={fontStyle === font ? "default" : "outline"}
          onClick={() => {
            changeFontStyle(font as keyof typeof fontStyles);
          }}
        >
          {font}
        </Button>
      ))}
    </div>
  );
}

const ResizeHandle = ({
  className,
  visible,
}: HTMLAttributes<HTMLDivElement> & { visible: boolean }) => (
  <div
    className={cn(
      "rounded-xl w-3 h-3 hover:bg-primary bg-input border border-primary cursor-pointer ",
      visible ? "visible" : "invisible",
      className
    )}
  />
);
