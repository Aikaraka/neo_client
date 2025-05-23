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
import { Dispatch, HTMLAttributes, SetStateAction, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Rnd } from "react-rnd";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CoverImageEditor() {
  const { coverImageRef, imageSrc, setCoverBgImageLoaded } = useCoverImageContext();
  const [titleFontSize, setTitleFontSize] = useState(BASE_FONT_SIZE);
  const [isTitleVisible, setIsTitleVisible] = useState(true);

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
            onLoad={() => {
              console.log('CoverImageEditor: Image onLoad event triggered for:', imageSrc);
              setCoverBgImageLoaded(true);
            }}
            onError={(e) => {
              console.error('CoverImageEditor: Image onError event triggered for:', imageSrc, e.nativeEvent);
              // 이미지 로드 실패 시에도 일단 로드 상태는 true로 설정하여 무한 로딩 방지 (캡처는 실패할 수 있음)
              setCoverBgImageLoaded(true); 
            }}
          />
        )}
        {!imageSrc && <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">표지 이미지 없음</div>}
        <TextEdit titleFontSize={titleFontSize} isTitleVisible={isTitleVisible} />
        </div>
      <ColorSelect />
      <FontSelect />
      <TitleControlButtons
        isTitleVisible={isTitleVisible}
        onToggleVisibility={() => setIsTitleVisible((v) => !v)}
        onIncreaseFontSize={() => setTitleFontSize((s) => s + 2)}
        onDecreaseFontSize={() => setTitleFontSize((s) => Math.max(10, s - 2))}
      />
      <CoverImageUploader />
      <CoverImageGenerator />
    </>
  );
}

const DEFAULT_WIDTH = 200,
  DEFAULT_HEIGHT = 100;
const BASE_FONT_SIZE = 28;

interface TextEditProps {
  titleFontSize: number;
  isTitleVisible: boolean;
}

function TextEdit({ titleFontSize, isTitleVisible }: TextEditProps) {
  const { getValues, setValue, watch } = useFormContext<CreateNovelForm>();
  const { fontTheme, fontStyle } = useCoverImageContext();
  const [size, setSize] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const [showEditMode, setShowEditMode] = useState(true);

 
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: getValues("title") || "",
    onUpdate: ({ editor }) => {
      setValue("title", editor.getHTML(), { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class: cn("stroke-gradient", fontThemes[fontTheme]),
      },
    },
  }, [fontTheme]);

  const watchedTitle = watch("title");
  useEffect(() => {
    if (editor && editor.getHTML() !== watchedTitle) {
      editor.commands.setContent(watchedTitle || "", false);
    }
  }, [watchedTitle, editor]);

  useEffect(() => {
    function handleClickTextzone(event: MouseEvent) {
      if (wrapperRef.current) {
        const isClickInside = wrapperRef.current.contains(event.target as Node);
        setShowEditMode(isClickInside);
        if (isClickInside && editor && !editor.isFocused) {
          editor.commands.focus();
        }
      }
    }

    document.addEventListener("click", handleClickTextzone);
    return () => {
      document.removeEventListener("click", handleClickTextzone);
    };
   }, [editor]);

  if (!isTitleVisible) {
    return null;
  }

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
      dragHandleClassName="cover-title-drag-handle" // Specific class for dragging

      className={cn(
        "absolute text-black text-2xl font-bold cursor-pointer z-10 p-1 cover-title-drag-handle", // Added drag handle class here
        showEditMode ? "border border-primary" : "",
      )}
    >
       <div
        ref={wrapperRef}
        className="w-full h-full"
      >
        <EditorContent
          editor={editor}
          className={cn(
            `text-box w-full h-full break-words overflow-auto cursor-text leading-[1.2] font-bold tracking-wider`, // Removed text-[${BASE_FONT_SIZE}px]
            "scrollbar-hidden relative focus:outline-none",
          )}
          style={{
            fontFamily: fontStyles[fontStyle],
            fontSize: `${titleFontSize}px`,
          }}
        />
      </div>
    </Rnd>
  );
}
interface TitleControlButtonsProps {
  isTitleVisible: boolean;
  onToggleVisibility: () => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
}

function TitleControlButtons({
  isTitleVisible,
  onToggleVisibility,
  onIncreaseFontSize,
  onDecreaseFontSize,
}: TitleControlButtonsProps) {
  return (
    <div className="flex gap-2 self-center my-2">
      <Button type="button" variant="outline" onClick={onToggleVisibility}>
        {isTitleVisible ? "숨기기" : "보이기"}
      </Button>
      <Button type="button" variant="outline" onClick={onIncreaseFontSize}>
        크게
      </Button>
      <Button type="button" variant="outline" onClick={onDecreaseFontSize}>
        작게
      </Button>
    </div>
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

