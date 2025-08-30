"use client"

import { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"
import { convertToWebP } from "@/utils/image" // convertToWebP 함수 import
import { useToast } from "@/hooks/use-toast"

interface ImageAssetUploadProps {
  onImageUpload: (file: File) => void
  initialImageUrl?: string
}

export function ImageAssetUpload({
  onImageUpload,
  initialImageUrl,
}: ImageAssetUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isConverting, setIsConverting] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB 크기 제한
        toast({
          title: "파일 크기 초과",
          description: "10MB 이하의 이미지를 업로드해주세요.",
          variant: "destructive",
        })
        return
      }

      setIsConverting(true)
      try {
        const webpFile = await convertToWebP(file)

        if (webpFile.size > 1024 * 1024) { // 1MB 크기 제한
          toast({
            title: "파일 크기 초과",
            description: "이미지 파일 크기가 너무 큽니다. 다른 이미지를 사용해주세요.",
            variant: "destructive",
          })
          return;
        }

        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(webpFile)
        onImageUpload(webpFile)
      } catch {
        toast({
          title: "이미지 변환 실패",
          description: "이미지를 WebP로 변환하는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsConverting(false)
        // 입력 값 초기화하여 동일한 파일 다시 선택 가능하도록
        if(e.target) e.target.value = '';
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setPreview(null)
    // You might want to notify parent component about removal
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">캐릭터 에셋 이미지</label>
      <div className="w-32 h-40 border-2 border-dashed rounded-lg flex items-center justify-center relative">
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Character asset preview"
              fill
              className="object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="flex flex-col items-center justify-center h-full w-full"
            onClick={handleButtonClick}
            disabled={isConverting}
          >
            {isConverting ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="mt-2 text-xs text-gray-500">변환 중...</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-xs text-gray-500">이미지 추가</span>
              </>
            )}
          </Button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
      </div>
      <p className="text-xs text-gray-500">
        캐릭터의 외형을 나타내는 이미지를 업로드하세요.
      </p>
    </div>
  )
}

