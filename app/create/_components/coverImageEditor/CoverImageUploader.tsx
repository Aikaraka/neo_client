"use client";

import { useRef, ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCoverImageContext } from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import ImageCropper from "@/app/create/_components/ImageCropper";

export function CoverImageUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { changeImage } = useCoverImageContext();

  const [originalImageSrcForCropping, setOriginalImageSrcForCropping] = useState<string | null>(null);
  const [showImageCropper, setShowImageCropper] = useState(false);

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImageSrcForCropping(reader.result as string);
      setShowImageCropper(true);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
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
    <div className="space-y-4">
      {/* <LoadingModal visible={isPending} /> */}
      <div className="space-y-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
          className="w-full"
          disabled={showImageCropper}
        >
          이미지 업로드
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
      </div>

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
