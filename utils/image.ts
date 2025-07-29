import imageCompression from "browser-image-compression";

function dataURLToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]); // base64 디코딩
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export { dataURLToFile };

/**
 * 이미지 파일을 WebP 포맷으로 변환합니다.
 * @param file - 변환할 이미지 파일
 * @param quality - WebP 품질 (0-1, 기본값 0.85)
 * @returns WebP로 변환된 파일
 */
export async function convertToWebP(file: File, quality: number = 0.85): Promise<File> {
  try {
    // browser-image-compression 옵션 설정
    const options = {
      maxSizeMB: 10, // 최대 파일 크기 10MB
      maxWidthOrHeight: 2048, // 최대 너비/높이 2048px (고화질 유지)
      useWebWorker: true, // 웹 워커 사용으로 성능 향상
      fileType: "image/webp", // WebP로 변환
      quality: quality, // 품질 설정
    };

    // 이미지 압축 및 WebP 변환
    const compressedFile = await imageCompression(file, options);
    
    // 파일명을 .webp 확장자로 변경
    const webpFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    
    // 새로운 File 객체 생성 (WebP 타입으로)
    return new File([compressedFile], webpFileName, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("WebP 변환 중 오류 발생:", error);
    // 변환 실패 시 원본 파일 반환
    return file;
  }
}

/**
 * Data URL을 WebP 파일로 변환합니다.
 * @param dataUrl - 변환할 Data URL
 * @param filename - 파일명 (확장자 제외)
 * @param quality - WebP 품질 (0-1, 기본값 0.85)
 * @returns WebP 파일
 */
export async function dataURLToWebP(
  dataUrl: string,
  filename: string,
  quality: number = 0.85
): Promise<File> {
  // 먼저 일반 파일로 변환
  const file = dataURLToFile(dataUrl, filename + ".png");
  
  // WebP로 변환
  return await convertToWebP(file, quality);
}

