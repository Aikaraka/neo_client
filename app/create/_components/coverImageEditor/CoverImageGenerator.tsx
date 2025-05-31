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

export default function CoverImageGenerator() {
  const { getValues } = useFormContext<CreateNovelForm>();
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

  async function handleGenerateCoverImage() {
    setAiImageModal(true);
    const formData = getValues();
    mutate(formData);
  }

  // URL을 Data URL로 변환하는 함수
  const convertToDataURL = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("이미지 변환 실패:", error);
      return url; // 실패 시 원본 URL 반환
    }
  };

  const handleImageSelect = async (url: string, idx: number) => {
    // 외부 URL을 Data URL로 변환
    const dataUrl = await convertToDataURL(url);
    changeImage(dataUrl);
    setSelectedImage(idx);
  };

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
                  onClick={() => handleImageSelect(url, idx)}
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
    </>
  );
}
