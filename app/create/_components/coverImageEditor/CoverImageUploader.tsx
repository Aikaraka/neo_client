"use client";

import { useRef, ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCoverImageContext } from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import ImageCropper from "@/app/create/_components/ImageCropper";
import { useToast } from "@/hooks/use-toast";
import { convertToWebP } from "@/utils/image";

export function CoverImageUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { changeImage } = useCoverImageContext();
  const { toast } = useToast();

  const [originalImageSrcForCropping, setOriginalImageSrcForCropping] = useState<string | null>(null);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "업로드 실패",
        description:
          "파일 크기가 너무 큽니다! 2MB 이하로 압축한 후 이용해주세요.",
        variant: "destructive",
      });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    setIsConverting(true);
    try {
      // WebP로 변환
      const webpFile = await convertToWebP(file);

      // 변환 후에도 2MB 체크
      if (webpFile.size > 1 * 1024 * 1024) {
        toast({
          title: "업로드 실패",
          description: "네오 로직으로 압축된 이미지가 1MB를 초과합니다. 더 작은 이미지를 업로드해주세요.",
          variant: "destructive",
        });
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setOriginalImageSrcForCropping(imageDataUrl);
        setShowImageCropper(true);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      };
      reader.readAsDataURL(webpFile);
    } catch {
      toast({
        title: "이미지 변환 실패",
        description: "이미지를 WebP로 변환하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } finally {
      setIsConverting(false);
    }
  };

  const handleCropComplete = (croppedImageDataUrl: string) => {
    changeImage(croppedImageDataUrl);
    setShowImageCropper(false);
    setOriginalImageSrcForCropping(null);
  };

  const handleCancelCrop = () => {
    setShowImageCropper(false);
    setOriginalImageSrcForCropping(null);
  };

  return (
    <div className="w-full">
      {/* <LoadingModal visible={isPending} /> */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
          className="w-full"
          disabled={showImageCropper || isConverting}
        >
          {isConverting ? "변환 중..." : "이미지 업로드"}
        </Button>
      <input
        ref={inputRef}
        id="file-upload"
        type="file"
        accept="image/*, .heic, .heif"
        className="hidden"
        multiple={false}
        onChange={handleUploadImage}
      />

      {showImageCropper && originalImageSrcForCropping && (
        <ImageCropper
          imageSrcToCrop={originalImageSrcForCropping}
          onCropComplete={handleCropComplete}
          onCancelCrop={handleCancelCrop}
          aspect={210 / 270}
        />
      )}
    </div>
  );
}
