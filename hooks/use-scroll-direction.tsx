import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const [prevOffset, setPrevOffset] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const threshold = 5; // 더 민감한 스크롤 감지
    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      
      // 최상단 체크 (Safari bounce 효과 고려)
      if (scrollY <= 0) {
        setIsAtTop(true);
        setScrollDirection("up"); // 최상단에서는 항상 표시
        ticking = false;
        return;
      } else {
        setIsAtTop(false);
      }

      // 스크롤 방향 감지
      const scrollDiff = scrollY - lastScrollY;
      
      if (Math.abs(scrollDiff) < threshold) {
        ticking = false;
        return;
      }

      // 아래로 스크롤 (숨김)
      if (scrollDiff > 0 && scrollY > 50) { // 50px 이상 스크롤 했을 때만 숨김
        setScrollDirection("down");
      } 
      // 위로 스크롤 (표시)
      else if (scrollDiff < 0) {
        setScrollDirection("up");
      }

      lastScrollY = scrollY;
      setPrevOffset(scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    // 초기 상태 설정
    updateScrollDirection();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return { scrollDirection, isAtTop };
} 