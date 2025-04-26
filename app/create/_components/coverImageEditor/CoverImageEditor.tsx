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
import Image from "next/image";
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

function TextEdit() {
  const { getValues } = useFormContext<CreateNovelForm>();
  const title = getValues("title");
  const { fontTheme, fontStyle } = useCoverImageContext();

  return (
    <Rnd
      default={{
        x: 0,
        y: 100,
        width: 200,
        height: 100,
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
      dragHandleClassName="text-box"
      className="absolute text-black text-2xl font-bold  cursor-pointer z-10 hover:border hover:border-purple-400 p-1"
    >
      <div
        className={`text-box w-full h-full break-words overflow-auto cursor-pointer text-transparent text-[28px] leading-[31px]  font-bold tracking-wider ${fontThemes[fontTheme]} scrollbar-hidden`}
        style={{
          fontFamily: fontStyles[fontStyle],
        }}
      >
        {title}
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
