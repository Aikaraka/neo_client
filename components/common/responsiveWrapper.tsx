"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { NavBarDesktop, NavBarMobile } from "../layout/navbar";
// 다양한 디자인 옵션들 import
import { 
  NavBarFloating, 
  NavBarGradient, 
  NavBarApple, 
  NavBarMaterial,
  NavBarFloatingMaterial
} from "../layout/navbar-designs";

// 🎨 네비게이션 바 디자인 설정
// 이곳에서 원하는 디자인으로 바꿀 수 있습니다!
const NAVBAR_DESIGN = "floating-material"; // "default" | "floating" | "gradient" | "apple" | "material" | "floating-material"

// 선택된 디자인에 따라 컴포넌트 결정
const getNavBarComponent = (design: string) => {
  switch (design) {
    case "floating":
      return NavBarFloating;
    case "gradient":
      return NavBarGradient;
    case "apple":
      return NavBarApple;
    case "material":
      return NavBarMaterial;
    case "floating-material":
      return NavBarFloatingMaterial;
    default:
      return NavBarMobile;
  }
};

export default function ResponsiveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isChatPage = pathname.includes("/chat");

  // 선택된 네비게이션 바 컴포넌트
  const SelectedNavBar = getNavBarComponent(NAVBAR_DESIGN);

  return (
    <div className="relative min-h-screen">
      {/* --- Sidebar --- */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out",
          isMobile ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <NavBarDesktop />
      </div>

      {/* --- Main Content --- */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out w-full",
          isMobile ? "pl-0" : "pl-[80px]",
          isMobile && !isChatPage ? "pb-mobile-nav" : "pb-0"
        )}
      >
        {children}
      </main>

      {/* --- Mobile Bottom Navigation --- */}
      {isMobile && !isChatPage && <SelectedNavBar />}
    </div>
  );
}
