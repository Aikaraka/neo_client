"use client";

import { useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { saveImageFileToStorage } from "@/app/create/_api/imageStorage.server";
import { useMutation } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { LoadingModal } from "@/components/ui/modal";

export function CoverImageUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { setValue, watch } = useFormContext<CreateNovelForm>();
  const selectedImage = watch("cover_image_url");
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: saveImageFileToStorage,
    onError: (error: Error) =>
      toast({ title: "이미지 업로드 오류", description: error.message ?? "" }),
    onSuccess: (imageUrl) => setValue("cover_image_url", imageUrl),
  });

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    mutate(file);
  };

  return (
    <div className="space-y-4">
      <LoadingModal visible={isPending} />
      {selectedImage && (
        <Image
          src={selectedImage}
          alt="선택된 표지 이미지"
          width={250}
          height={250}
          className="object-cover rounded-lg w-full h-full max-h-96"
        />
      )}
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
