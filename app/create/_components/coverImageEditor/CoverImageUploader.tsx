"use client";

import { useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { useCoverImageContext } from "@/app/create/_components/coverImageEditor/CoverImageProvider";

export function CoverImageUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { changeImage } = useCoverImageContext();

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageSrc = reader.result as string;
      changeImage(imageSrc);
    };
    reader.readAsDataURL(file);
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
        >
          이미지 업로드
        </Button>
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          multiple={false}
          onChange={handleUploadImage}
        />
      </div>
    </div>
  );
}
