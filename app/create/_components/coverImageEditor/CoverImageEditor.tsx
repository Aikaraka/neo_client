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
  const { coverImageRef, imageSrc } = useCoverImageContext();
  const [showTitle, setShowTitle] = useState(true);
  const [fontSize, setFontSize] = useState(BASE_FONT_SIZE);

  const changeFontSize = (delta: number) =>
    setFontSize((prev) => Math.max(12, prev + delta));

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
        {showTitle && <TextEdit fontSize={fontSize} />}
      </div>
      <ColorSelect />
      <TitleControls
        show={showTitle}
        toggle={() => setShowTitle((prev) => !prev)}
        increase={() => changeFontSize(2)}
        decrease={() => changeFontSize(-2)}
      />
      <FontSelect />
      <CoverImageUploader />
      <CoverImageGenerator />
    </>
  );
}

const DEFAULT_WIDTH = 200,
  DEFAULT_HEIGHT = 100;
const BASE_FONT_SIZE = 28;

function TextEdit({ fontSize }: { fontSize: number }) {
  const { watch, setValue } = useFormContext<CreateNovelForm>();
  const title = watch("title");
  const { fontTheme, fontStyle } = useCoverImageContext();
  const [size, setSize] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const [showEditMode, setShowEditMode] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize],
    content: title,
    editorProps: {
      attributes: {
        class:
          "outline-none w-full h-full bg-transparent text-box break-words overflow-visible cursor-pointer text-transparent leading-[31px] font-bold tracking-wider scrollbar-hidden",
      },
    },
    onUpdate({ editor }) {
      setValue("title", editor.getText());
    },
  });

  useEffect(() => {
    if (editor && title !== editor.getText()) {
      editor.commands.setContent(title);
    }
  }, [title, editor]);

  const dynamicFontSize = (size.width / DEFAULT_WIDTH) * fontSize;
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickTextzone(event: MouseEvent) {
      if (wrapperRef.current) {
        if (wrapperRef.current.contains(event.target as Node)) {
          setShowEditMode(true);
        } else {
          setShowEditMode(false);
        }
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
        <EditorContent
          editor={editor}
          style={{
            fontFamily: fontStyles[fontStyle],
            fontSize: `${dynamicFontSize}px`,
          }}
          className={`${fontThemes[fontTheme]} relative`}
        />
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

function TitleControls({
  show,
  toggle,
  increase,
  decrease,
}: {
  show: boolean;
  toggle: () => void;
  increase: () => void;
  decrease: () => void;
}) {
  return (
    <div className="flex gap-2 self-center mt-2">
      <Button type="button" onClick={toggle} size="sm">
        {show ? "숨기기" : "보이기"}
      </Button>
      <div className="flex gap-1">
        <Button type="button" onClick={decrease} size="sm">
          -
        </Button>
        <Button type="button" onClick={increase} size="sm">
          +
        </Button>
      </div>
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
