"use client";

import { generateImage } from "@/app/create/_api/image.server";
import { useCoverImageContext } from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { useCoverGenerationCount } from "@/hooks/useCoverGenerationCount";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function CoverImageGenerator() {
  const { getValues } = useFormContext<CreateNovelForm>();
  const { changeImage } = useCoverImageContext();
  const { toast } = useToast();
  const { decreaseCount, hasRemaining } = useCoverGenerationCount();
  
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
    onSuccess: (result) => {
      // 표지 생성 성공 시 횟수 차감
      decreaseCount();
      
      // 이미지 생성 성공 시 미리 변환 시작
      if (result?.urls) {
        preloadAndConvertImages(result.urls);
      }
    },
  });
  const [selected, setSelectedImage] = useState<number | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [aiImageModal, setAiImageModal] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Map<string, string>>(new Map());
  const [preloadProgress, setPreloadProgress] = useState(0);

  async function handleGenerateCoverImage() {
    if (!hasRemaining) {
      toast({
        title: "표지 생성 횟수 초과",
        description: "표지 생성은 최대 3번까지 가능합니다.",
        variant: "destructive",
      });
      return;
    }
    
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
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`프록시 요청 실패: ${response.status}`);
      }
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
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

  // 이미지들을 미리 변환하는 함수
  const preloadAndConvertImages = async (urls: string[]) => {
    const totalImages = urls.length;
    let completed = 0;
    
    const convertPromises = urls.map(async (url) => {
      try {
        const dataUrl = await convertToDataURL(url);
        setPreloadedImages(prev => new Map(prev).set(url, dataUrl));
        completed++;
        setPreloadProgress(Math.round((completed / totalImages) * 100));
      } catch (error) {
        console.error('CoverImageGenerator: 프리로드 실패', url, error);
      }
    });
    
    await Promise.allSettled(convertPromises);
  };

  const handleImageSelect = async (url: string, idx: number) => {
    
    // 이미 변환 중이면 무시
    if (isConverting) return;
    
    // 일단 선택 표시를 즉시 업데이트 (사용자 피드백)
    setSelectedImage(idx);
    
    // 미리 변환된 이미지가 있는지 확인
    const preloadedDataUrl = preloadedImages.get(url);
    if (preloadedDataUrl) {
      setSelectedImageUrl(preloadedDataUrl);
      return;
    }
    
    // 프리로드되지 않은 경우에만 변환 시작
    setIsConverting(true); // 변환 시작
    
    try {
      // 외부 URL을 Data URL로 변환
      const dataUrl = await convertToDataURL(url);
      setSelectedImageUrl(dataUrl);
      // 변환된 이미지를 캐시에 저장
      setPreloadedImages(prev => new Map(prev).set(url, dataUrl));
    } catch (error) {
      console.error('CoverImageGenerator: 변환 실패', error);
      toast({
        title: "이미지 처리 실패",
        description: "이미지를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
      setSelectedImage(null);
    } finally {
      setIsConverting(false); // 변환 완료
    }
  };

  const handleComplete = () => {
    if (selectedImageUrl) {
      changeImage(selectedImageUrl);
      toast({
        title: "표지 이미지 설정 완료",
        description: "AI가 생성한 이미지가 표지로 설정되었습니다.",
      });
    } else {
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
    setSelectedImage(null);
    setSelectedImageUrl(null);
    setIsConverting(false);
    setAiImageModal(false);
  };

  return (
    <>
      <Button
        type="button"
        className="w-full"
        onClick={handleGenerateCoverImage}
        disabled={!hasRemaining}
      >
        <Sparkles />
        세계관 표지 ai 생성
        {!hasRemaining && <span className="ml-2 text-xs">(횟수 초과)</span>}
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        줄거리나 등장인물 작성 후 표지 생성 버튼을 누르면 그에 맞는 이미지를
        받아볼 수 있어요!
      </p>

      <Modal
        open={aiImageModal}
        backgroundClose={false}
        switch={handleCancel}
        type="none"
      >
        <div className="w-full items-center flex flex-col gap-4 justify-center">
          {isPending ? (
            <div className="flex flex-col items-center gap-3">
              <Spinner />
              <p className="text-sm text-muted-foreground">AI가 표지를 생성하고 있습니다...</p>
            </div>
          ) : (
            <>
              {/* 프리로드 진행 상태 표시 */}
              {data?.urls && preloadProgress < 100 && (
                <div className="w-full px-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>이미지 최적화 중... {preloadProgress}%</span>
                  </div>
                </div>
              )}
              <div className="md:w-[400px] grid grid-cols-2 gap-2 items-center w-[300px]">
                {data?.urls.map((url, idx) => (
                  <div
                    className={`w-full h-full relative cursor-pointer ${
                      isConverting && selected === idx ? 'opacity-50' : ''
                    }`}
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
                    {isConverting && selected === idx && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                          <p className="text-xs text-white">처리중...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="flex gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={isConverting}
            >
              취소
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleComplete}
              disabled={selected === null || isConverting}
            >
              {isConverting ? "처리중..." : "완료"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
