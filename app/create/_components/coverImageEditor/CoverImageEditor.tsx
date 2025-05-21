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
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "@tiptap/extension-font-size";

export default function CoverImageEditor() {
  const { coverImageRef, imageSrc, fontTheme, changeFontTheme, fontStyle, changeFontStyle } = useCoverImageContext();
  const [showTitle, setShowTitle] = useState(true);
  const [fontSize, setFontSize] = useState(BASE_FONT_SIZE);

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
        <CoverTitleEditor showTitle={showTitle} fontSize={fontSize} fontTheme={fontTheme} fontStyle={fontStyle} />
      </div>
      <ColorSelect changeFontTheme={changeFontTheme} fontTheme={fontTheme} />
      <FontSelect />
      <div className="flex gap-2 justify-center my-2">
        <Button onClick={() => setFontSize(f => Math.max(12, f - 2))}>-</Button>
        <Button onClick={() => setFontSize(f => f + 2)}>+</Button>
        <Button onClick={() => setShowTitle(v => !v)}>
          {showTitle ? "숨기기" : "보이기"}
        </Button>
      </div>
      <CoverImageUploader />
      <CoverImageGenerator />
    </>
  );
}

const DEFAULT_WIDTH = 200,
  DEFAULT_HEIGHT = 100;
const BASE_FONT_SIZE = 28;

function CoverTitleEditor({ showTitle, fontSize, fontTheme, fontStyle }: { showTitle: boolean; fontSize: number; fontTheme: string; fontStyle: string }) {
  const { setValue, getValues } = useFormContext();
  const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize],
    content: `<h1>${getValues("title") || "제목을 입력하세요"}</h1>`,
    onUpdate: ({ editor }) => {
      setValue("title", editor.getText());
    },
    editorProps: {
      attributes: {
        class: `outline-none w-full h-full bg-transparent ${fontTheme} bg-clip-text text-transparent`,
        style: `font-size: ${fontSize}px; text-align: center; font-family: ${fontStyle};`,
      },
    },
  });

  useEffect(() => {
    if (editor && getValues("title") !== editor.getText()) {
      editor.commands.setContent(`<h1>${getValues("title")}</h1>`);
    }
  }, [getValues("title")]);

  useEffect(() => {
    if (editor) {
      editor.chain().focus().setFontSize(`${fontSize}px`).run();
    }
  }, [fontSize]);

  if (!showTitle) return null;

  return (
    <Rnd
      default={{ x: 0, y: 100, width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }}
      bounds="parent"
      onResize={(_, __, ref) => setSize({ width: ref.offsetWidth, height: ref.offsetHeight })}
      enableResizing={{ bottomRight: true, right: true, bottom: true, top: true, left: true, topRight: true }}
      className="absolute z-10 border border-primary bg-white/80 min-w-[100px] min-h-[40px] rounded-md"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <EditorContent
          editor={editor}
          style={{ fontSize: `${fontSize}px`, textAlign: "center" }}
          className={`w-full h-full bg-transparent ${fontTheme} bg-clip-text text-transparent`}
        />
      </div>
    </Rnd>
  );
}

function ColorSelect({ changeFontTheme, fontTheme }: { changeFontTheme: (theme: any) => void, fontTheme: string }) {
  return (
    <div className="flex gap-2 self-center">
      {Object.keys(fontThemes).map((color) => (
        <button
          key={`color-${color}`}
          type="button"
          className={`rounded-full w-8 h-8 border-2 ${fontThemes[color as keyof typeof fontThemes]} bg-clip-padding overflow-hidden ${fontTheme === color ? 'border-primary' : 'border-gray-300'}`}
          onClick={() => changeFontTheme(color as keyof typeof fontThemes)}
        />
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
