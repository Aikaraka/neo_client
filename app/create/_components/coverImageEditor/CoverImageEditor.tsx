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
import { useEffect, useRef, useState, HTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { Rnd } from "react-rnd";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CoverImageEditor() {
  const { coverImageRef, imageSrc, setCoverBgImageLoaded } = useCoverImageContext();
  const [titleFontSize, setTitleFontSize] = useState(BASE_FONT_SIZE);
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const [imageRetryCount, setImageRetryCount] = useState(0);
  const MAX_RETRY_COUNT = 3;

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
            className="w-full h-full object-cover"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            unoptimized
            crossOrigin="anonymous"
            priority
            onLoad={() => {
              setCoverBgImageLoaded(true);
              setImageRetryCount(0);
            }}
            onError={(e) => {
              console.error('CoverImageEditor: Image onError event triggered for:', imageSrc, e.nativeEvent);
              if (imageRetryCount < MAX_RETRY_COUNT) {
                setImageRetryCount(prev => prev + 1);
                const newSrc = imageSrc.includes('?') ? 
                  `${imageSrc}&retry=${Date.now()}` : 
                  `${imageSrc}?retry=${Date.now()}`;
                setTimeout(() => {
                  const img = new window.Image();
                  img.src = newSrc;
                  img.onload = () => {
                    setCoverBgImageLoaded(true);
                  };
                }, 500 * imageRetryCount);
              } else {
              setCoverBgImageLoaded(true); 
              }
            }}
          />
        )}
        {!imageSrc && <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">표지 이미지 없음</div>}
        <TextEdit titleFontSize={titleFontSize} isTitleVisible={isTitleVisible} />
        </div>
      <div className="flex flex-col gap-2 items-center w-full mt-2">
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
      </div>
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
  const [, setSize] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const [showEditMode, setShowEditMode] = useState(true);

 
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // HTML 태그 제거 함수
  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: stripHtml(getValues("title") || ""), // HTML 태그 제거된 텍스트로 초기화
    onUpdate: ({ editor }) => {
      // HTML 대신 순수 텍스트만 저장
      setValue("title", editor.getText(), { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class: cn("stroke-gradient", fontThemes[fontTheme]),
      },
    },
  }, [fontTheme]);

  const watchedTitle = watch("title");
  useEffect(() => {
    if (editor && editor.getText() !== stripHtml(watchedTitle)) {
      editor.commands.setContent(stripHtml(watchedTitle || ""), false);
    }
  }, [watchedTitle, editor]);

  useEffect(() => {
    function handleClickTextzone(event: MouseEvent | TouchEvent) {
      if (wrapperRef.current) {
        const target = event.target as Node;
        const isClickInside = wrapperRef.current.contains(target);
        setShowEditMode(isClickInside);
        if (isClickInside && editor && !editor.isFocused) {
          editor.commands.focus();
        }
      }
    }

    // 모바일과 데스크톱 모두 지원
    document.addEventListener("click", handleClickTextzone);
    document.addEventListener("touchend", handleClickTextzone);
    return () => {
      document.removeEventListener("click", handleClickTextzone);
      document.removeEventListener("touchend", handleClickTextzone);
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
      dragHandleClassName="cover-title-drag-handle"
      style={{
        touchAction: 'none', // 모바일에서 터치 이벤트 처리 개선
      }}
      className={cn(
        "absolute text-black text-2xl font-bold cursor-pointer z-10 cover-title-drag-handle box-border",
        showEditMode ? "border border-primary" : "border border-transparent",
      )}
    >
       <div
        ref={wrapperRef}
        className="w-full h-full"
      >
        <EditorContent
          editor={editor}
          className={cn(
            `text-box w-full h-full break-words overflow-auto cursor-text leading-[1.2] font-bold tracking-wider`,
            "scrollbar-hidden relative focus:outline-none",
            "[&_.ProseMirror]:caret-transparent", // 커서 숨기기
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
  
  const handleFontChange = (targetFont: keyof typeof fontStyles) => {
    changeFontStyle(targetFont);
  };
  
  return (
    <div className="flex gap-2 self-center">
      {Object.keys(fontStyles).map((font) => (
        <Button
          key={`font-${font}`}
          type="button"
          style={{ fontFamily: fontStyles[font as keyof typeof fontStyles] }}
          variant={fontStyle === font ? "default" : "outline"}
          onClick={() => handleFontChange(font as keyof typeof fontStyles)}
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
      "rounded-xl w-3 h-3 hover:bg-primary bg-background border border-primary cursor-pointer",
      visible ? "visible" : "invisible",
      className
    )}
    style={{
      touchAction: 'none', // 모바일에서 터치 이벤트 처리 개선
      WebkitTapHighlightColor: 'transparent', // 모바일에서 탭 하이라이트 제거
      pointerEvents: 'auto', // 모바일에서 포인터 이벤트 명시적 활성화
      zIndex: 20, // 모바일에서도 보이도록 z-index 증가
    }}
  />
);

