"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const supabaseStorageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/banner`;

const banners = [
  {
    image: `${supabaseStorageUrl}/banner1_text.png`,
    title: "작가용 가이드",
    link: "https://neo.featurebase.app/en/help/articles/4900456-writinghand-jaggayong-gaideu",
    external: true,
  },
  {
    image: `${supabaseStorageUrl}/banner2_text.png`,
    title: "유저용 가이드1",
    link: "https://neo.featurebase.app/en/help/articles/2014044-tada-nano-banana-tabjaehan-ai-soseol-peulraespom-deungjang-banana",
    external: true,
  },
  {
    image: `${supabaseStorageUrl}/banner3_text.png`,
    title: "유저용 가이드2",
    link: "https://neo.featurebase.app/en/help/articles/8854968-yujeoyong-gaideu-v1",
    external: true,
  },
];

export function MainBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, 5000); // 5초마다 다음 배너로 이동
    return () => clearTimeout(timer);
  }, [currentIndex, goToNext]);

  return (
    <div className="relative w-full aspect-[1160/384] overflow-hidden rounded-lg mb-8">
      {banners.map((banner, index) => {
        const imageContent = (
          <div
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              sizes="(max-width: 768px) 100vw, 1160px"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        );

        if (banner.link) {
          if (banner.external) {
            // 외부 링크는 a 태그 사용
            return (
              <a
                key={index}
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`cursor-pointer ${index === currentIndex ? 'pointer-events-auto' : 'pointer-events-none'}`}
              >
                {imageContent}
              </a>
            );
          } else {
            // 내부 링크는 Link 컴포넌트 사용
            return (
              <Link
                key={index}
                href={banner.link}
                className={`cursor-pointer ${index === currentIndex ? 'pointer-events-auto' : 'pointer-events-none'}`}
              >
                {imageContent}
              </Link>
            );
          }
        }

        // 링크가 없는 경우 그냥 이미지만 표시
        return <div key={index}>{imageContent}</div>;
      })}
       <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-1 md:left-4 -translate-y-1/2 z-10 p-1 md:p-2 bg-black bg-opacity-50 rounded-full text-white transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-1 md:right-4 -translate-y-1/2 z-10 p-1 md:p-2 bg-black bg-opacity-50 rounded-full text-white transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
      </button>
       <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-1.5 md:space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full transition-all ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
