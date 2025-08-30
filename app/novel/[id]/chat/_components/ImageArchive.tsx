"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStoryContext } from "./storyProvider";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImageArchiveProps {
  className?: string;
}

export function ImageArchive({ className }: ImageArchiveProps) {
  const { archivedImages, isGeneratingImage } = useStoryContext();
  const [, setSelectedImage] = useState<string | null>(null);

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `story-image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
    }
  };

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {archivedImages.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 group-hover:shadow-lg transition-all duration-200">
            <Image
              src={imageUrl}
              alt={`Story image ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-3">
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-0 shadow-sm"
                      onClick={() => setSelectedImage(imageUrl)}
                    >
                      <Maximize2 className="h-4 w-4 text-gray-700" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>이미지 {index + 1}</DialogTitle>
                    </DialogHeader>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={imageUrl}
                        alt={`Story image ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 80vw"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-0 shadow-sm"
                  onClick={() => handleDownload(imageUrl, index)}
                >
                  <Download className="h-4 w-4 text-gray-700" />
                </Button>
              </div>
            </div>

            <div className="absolute top-3 left-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-semibold text-gray-700 shadow-sm">
              {index + 1}
            </div>
          </div>
        </div>
      ))}

      {isGeneratingImage && (
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-blue-700">생성 중...</p>
            <p className="text-xs text-blue-500 mt-1">
              잠시만 기다려주세요
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
