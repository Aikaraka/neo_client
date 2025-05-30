// neo_client/app/create/_components/ImageCropper.tsx

"use client";

import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop,convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// 캔버스에 크롭된 이미지를 그리는 헬퍼 함수
function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: Crop // 이제 Crop은 항상 픽셀 단위라고 가정
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // 이미지를 캔버스 중앙으로 이동시키거나 하는 복잡한 translate 로직 대신
  // crop 영역을 기준으로 직접 그립니다.
  ctx.drawImage(
    image,
    cropX,
    cropY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );
}

interface ImageCropperProps {
  imageSrcToCrop: string; // 사용자가 업로드한 이미지의 URL (Data URL)
  onCropComplete: (croppedImageDataUrl: string) => void; // 크롭 완료 시 호출될 콜백
  onCancelCrop: () => void; // 크롭 취소 시 호출될 콜백
  aspect?: number; // 종횡비 (예: 1 (정사각형), 210 / 270 (표지 비율))
}

export default function ImageCropper({
  imageSrcToCrop,
  onCropComplete,
  onCancelCrop,
  aspect = 210 / 270, // 표지 비율에 맞춤 (210x270)
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  // completedCrop은 onComplete 핸들러에서 픽셀 값으로 변환된 crop을 저장하는 데 사용될 수 있습니다.
  // 여기서는 onComplete에서 바로 캔버스 미리보기를 생성하고 콜백을 호출합니다.
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
  }

  async function handleFinalizeCrop() {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    if (!image || !canvas || !crop || !crop.width || !crop.height) {
      // crop.width와 crop.height가 있어야 유효한 크롭으로 간주
      alert('크롭 영역을 선택해주세요.');
      return;
    }

    // ReactCrop의 onComplete는 percent crop을 반환할 수 있으므로 pixel crop으로 변환
    // 하지만 onChange에서 이미 percentCrop을 받고 있으므로, crop 상태는 percent일 수 있음
    // canvasPreview는 pixel crop을 기대하므로 변환 필요
    const pixelCrop = crop.unit === '%' ? convertToPixelCrop(crop, image.width, image.height) : crop;


    canvasPreview(image, canvas, pixelCrop);
    const croppedDataUrl = canvas.toDataURL('image/png');
    onCropComplete(croppedDataUrl);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full">
        <h3 className="text-xl font-semibold mb-4 text-center">표지 영역 지정</h3>
        <div className="flex justify-center mb-4" style={{ maxHeight: '60vh', overflow: 'hidden' }}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            // onComplete={(c) => setCompletedCrop(c)} // 필요시 completedCrop 상태 사용
            aspect={aspect}
            minWidth={100}
            minHeight={Math.floor(100 * (1/aspect))} // 종횡비에 따른 최소 높이
            keepSelection // 영역 이동시에도 선택 유지
            className="max-w-full max-h-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              alt="이미지 크롭"
              src={imageSrcToCrop}
              onLoad={onImageLoad}
              style={{ objectFit: 'contain', maxHeight: '55vh' }} // 이미지 컨테이너에 맞게 조절
            />
          </ReactCrop>
        </div>
        {/* 크롭된 이미지 미리보기용 캔버스 (실제로는 숨겨짐) */}
        <canvas
          ref={previewCanvasRef}
          style={{
            display: 'none', // 사용자에게 직접 보여줄 필요 없음
            objectFit: 'contain',
          }}
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onCancelCrop}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleFinalizeCrop}
            disabled={!crop?.width || !crop?.height}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            이 영역 사용하기
          </button>
        </div>
      </div>
    </div>
  );
}