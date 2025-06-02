import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return new Response('Image URL is required', { status: 400 });
    }

    // S3 URL만 허용 (보안을 위해)
    if (!imageUrl.includes('s3') && !imageUrl.includes('amazonaws')) {
      return new Response('Invalid image URL', { status: 400 });
    }

    // 원본 이미지 가져오기
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS Image Proxy)',
        'Accept': 'image/*',
      },
    });

    if (!imageResponse.ok) {
      return new Response('Failed to fetch image', { status: imageResponse.status });
    }

    let contentType = imageResponse.headers.get('content-type');
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Content-Type이 없거나 octet-stream인 경우, 이미지 시그니처로 타입 감지
    if (!contentType || contentType === 'application/octet-stream') {
      const bytes = new Uint8Array(imageBuffer);
      
      // 이미지 시그니처 확인
      if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
        contentType = 'image/jpeg';
      } else if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        contentType = 'image/png';
      } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
        contentType = 'image/gif';
      } else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
        contentType = 'image/webp';
      } else {
        // 기본값으로 PNG 설정
        contentType = 'image/png';
      }
    }

    // 이미지를 클라이언트에 전달 (CORS 헤더 포함)
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 