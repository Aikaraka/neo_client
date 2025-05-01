"use client";

import { generateImage } from "@/app/create/_api/image.server";
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
  const { getValues, setValue } = useFormContext<CreateNovelForm>();
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
  const selectedImageUrl = getValues("cover_image_url");
  const [aiImageModal, setAiImageModal] = useState(false);

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
                    setValue("cover_image_url", url);
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
                      selectedImageUrl === url ? "bg-neo" : "bg-white"
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
