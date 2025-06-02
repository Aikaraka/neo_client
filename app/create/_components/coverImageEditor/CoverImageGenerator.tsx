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
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [aiImageModal, setAiImageModal] = useState(false);

  async function handleGenerateCoverImage() {
    setAiImageModal(true);
    // 모달을 열 때 이전 선택 상태 초기화
    setSelectedImage(null);
    setSelectedImageUrl(null);
    const formData = getValues();
    mutate(formData);
  }

  // URL을 Data URL로 변환하는 함수 (프록시 사용)
  const convertToDataURL = async (url: string): Promise<string> => {
    try {
      // Data URL인 경우 그대로 반환
      if (url.startsWith('data:')) {
        return url;
      }
      
      // S3 URL인 경우 프록시를 통해 가져오기
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
      console.log('CoverImageGenerator: 프록시 URL 사용:', proxyUrl);
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`프록시 요청 실패: ${response.status}`);
      }
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          console.log('CoverImageGenerator: Data URL 변환 성공:', result.substring(0, 50));
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("CoverImageGenerator: 이미지 변환 실패:", error);
      // 프록시 실패 시에도 원본 URL 반환 (fallback)
      return url;
    }
  };

  const handleImageSelect = async (url: string, idx: number) => {
    console.log('CoverImageGenerator: 이미지 선택됨', url.substring(0, 50));
    // 외부 URL을 Data URL로 변환
    const dataUrl = await convertToDataURL(url);
    setSelectedImage(idx);
    setSelectedImageUrl(dataUrl);
    console.log('CoverImageGenerator: Data URL 변환 완료', dataUrl.substring(0, 50));
  };

  const handleComplete = () => {
    if (selectedImageUrl) {
      console.log('CoverImageGenerator: 선택된 이미지로 변경', selectedImageUrl.substring(0, 50));
      changeImage(selectedImageUrl);
      toast({
        title: "표지 이미지 설정 완료",
        description: "AI가 생성한 이미지가 표지로 설정되었습니다.",
      });
    } else {
      console.log('CoverImageGenerator: 이미지가 선택되지 않음, 기존 이미지 유지');
      toast({
        title: "이미지 선택 안됨",
        description: "이미지를 선택한 후 완료 버튼을 눌러주세요.",
        variant: "destructive",
      });
      return; // 모달을 닫지 않음
    }
    setAiImageModal(false);
  };

  const handleCancel = () => {
    console.log('CoverImageGenerator: 모달 취소');
    setSelectedImage(null);
    setSelectedImageUrl(null);
    setAiImageModal(false);
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
        switch={handleCancel}
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
          <div className="flex gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleComplete}
              disabled={selected === null}
            >
              완료
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
