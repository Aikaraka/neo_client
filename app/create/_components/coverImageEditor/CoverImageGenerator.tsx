"use client";

import { generateImage } from "@/app/create/_api/image.server";
import { useCoverImageContext } from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "@tiptap/extension-font-size";

export default function CoverImageGenerator() {
  const { getValues, setValue } = useFormContext<CreateNovelForm>();
  const { changeImage } = useCoverImageContext();
  const { toast } = useToast();
  const { data, isPending, mutate } = useMutation({
    mutationFn: generateImage,
    onError: () => {
      toast({
        title: "AI 이미지 생성 오류",
        description: "AI 이미지 생성에 실패했습니다.",
        variant: "destructive",
      });
      setAiImageModal(false);
    },
  });
  const [selected, setSelectedImage] = useState<number | null>(null);
  const [aiImageModal, setAiImageModal] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [fontSize, setFontSize] = useState(28);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
    ],
    content: "<h1>제목을 입력하세요</h1>",
    editorProps: {
      attributes: {
        class: "outline-none w-full h-full bg-transparent",
        style: `font-size: ${fontSize}px; text-align: center;`,
      },
    },
  });

  const changeFontSize = (delta: number) => {
    setFontSize((prev) => Math.max(12, prev + delta));
    if (editor) {
      editor.commands.setFontSize(`${Math.max(12, fontSize + delta)}px`);
    }
  };

  async function handleGenerateCoverImage() {
    setAiImageModal(true);
    const formData = getValues();
    mutate(formData);
  }

  return (
    <>
      <Button
        type="button"
        className="w-full"
        onClick={handleGenerateCoverImage}
      >
        <Sparkles />
        소설 표지 ai 생성
      </Button>

      <Modal
        open={aiImageModal}
        backgroundClose={false}
        switch={() => setAiImageModal(false)}
        type="none"
      >
        <div className="w-full items-center flex flex-col gap-4 justify-center">
          {isPending ? (
            <Spinner />
          ) : (
            <div className="md:w-[400px] grid grid-cols-2 gap-2 items-center w-[300px]">
              {data?.urls.map((url, idx) => (
                <div
                  className="w-full h-full relative cursor-pointer"
                  key={`ai-Generate-${idx}`}
                  onClick={() => {
                    changeImage(url);
                    setSelectedImage(idx);
                  }}
                >
                  <Image
                    src={url}
                    alt="ai 생성 이미지"
                    width={200}
                    height={200}
                  />
                  <div
                    className={`w-5 h-5 rounded-full absolute top-2 right-2 border-purple-600 border-2 ${
                      selected === idx ? "bg-neo" : "bg-white"
                    }`}
                  ></div>
                </div>
              ))}
            </div>
          )}
          <Button
            type="button"
            className="w-full"
            onClick={() => setAiImageModal(false)}
          >
            완료
          </Button>
        </div>
      </Modal>

      <div className="relative w-full h-full">
        <Button
          type="button"
          onClick={() => setShowTitle((prev) => !prev)}
          className="absolute top-1 right-1 z-20"
          size="sm"
        >
          {showTitle ? "숨기기" : "보이기"}
        </Button>
        <div className="absolute top-1 left-1 z-20 flex gap-1">
          <Button type="button" onClick={() => changeFontSize(-2)} size="sm">
            -
          </Button>
          <Button type="button" onClick={() => changeFontSize(2)} size="sm">
            +
          </Button>
        </div>
        {showTitle && (
          <EditorContent
            editor={editor}
            style={{ fontSize: `${fontSize}px`, textAlign: "center" }}
            className="w-full h-full bg-transparent"
          />
        )}
      </div>
    </>
  );
}
