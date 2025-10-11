"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { NavBarDesktop } from "../layout/navbar";
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
      return NavBarFloatingMaterial; 
  }
};

export default function ResponsiveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatPage = pathname.includes("/chat");
  const SelectedNavBar = getNavBarComponent(NAVBAR_DESIGN);

  return (
    <div className="min-h-screen md:relative">
      {/* --- Sidebar (Desktop Only) --- */}
      <div className="hidden md:block fixed top-0 left-0 h-full z-50">
        <NavBarDesktop />
      </div>

      {/* --- Main Content --- */}
      <main
        className={cn(
          "w-full",
          "md:pl-[80px]", 
          !isChatPage
        )}
      >
        {children}
      </main>

      {/* --- Mobile Bottom Navigation --- */}
      {!isChatPage && (
        <div className="md:hidden">
          <SelectedNavBar />
        </div>
      )}
    </div>
  );
}
