"use client";

import { cn } from "@/lib/utils";
import { FC, forwardRef, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { motion } from "motion/react";
import { PencilLine, Plus } from "lucide-react";
import {
  BoxFilled,
  HomeFilled,
  UserFilled,
  BoxLine,
  HomeLine,
  UserLine,
} from "@/public/navbar";

const navItems = {
  "/": {
    label: "홈",
    icon: HomeLine,
    activeIcon: HomeFilled,
    disabled: false,
  },
  "/library": {
    label: "보관함",
    icon: BoxLine,
    activeIcon: BoxFilled,
    disabled: false,
  },
  "/create": {
    label: "세계관 제작",
    icon: PencilLine,
    activeIcon: Plus,
    disabled: false,
  },
  "/mypage": {
    label: "마이네오",
    icon: UserLine,
    activeIcon: UserFilled,
    disabled: false,
  },
};

// 디자인 옵션 1: 플로팅 스타일 (여백이 있는 둥근 네비게이션)
function FloatingNavItem({
  path,
  label,
  icon,
  activeIcon,
  isActive,
  disabled,
}: {
  path: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  isActive: boolean;
  disabled: boolean;
}) {
  const NavIcon = isActive ? activeIcon : icon;

  return disabled ? (
    <div className="flex flex-col items-center justify-center relative p-2 cursor-not-allowed opacity-50">
      <NavIcon className="h-6 w-6" />
      <span className="text-[9px] mt-1">{label}</span>
    </div>
  ) : (
    <Link
      href={path}
      className={cn(
        "group relative flex flex-col items-center justify-center px-4 py-3 rounded-2xl transition-all duration-300",
        isActive && "bg-white shadow-lg"
      )}
    >
      <NavIcon className={cn(
        "h-6 w-6 transition-all duration-300",
        isActive 
          ? "text-purple-600 scale-110" 
          : "text-gray-500 group-hover:text-gray-700"
      )} />
      <span className={cn(
        "text-[9px] mt-1 font-medium transition-all duration-300",
        isActive 
          ? "text-purple-600 font-semibold" 
          : "text-gray-500 group-hover:text-gray-700"
      )}>
        {label}
      </span>
    </Link>
  );
}

export const NavBarFloating = forwardRef<HTMLDivElement>((props, ref) => {
  const pathname = usePathname() || "/";
  const { scrollDirection, isAtTop } = useScrollDirection();
  const isVisible = scrollDirection !== "down" || isAtTop;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]",
      !isVisible && "translate-y-full"
    )}>
      <nav className="bg-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-w-sm mx-auto border border-white/20">
        <div className="flex justify-around items-center py-2 px-3" ref={ref}>
          {Object.entries(navItems).map(
            ([path, { label, icon, activeIcon, disabled }]) => (
              <FloatingNavItem
                key={path}
                path={path}
                label={label}
                icon={icon}
                activeIcon={activeIcon}
                isActive={pathname === path}
                disabled={disabled}
              />
            )
          )}
        </div>
      </nav>
    </div>
  );
});

// 디자인 옵션 2: 그라데이션 활성 상태
function GradientNavItem({
  path,
  label,
  icon,
  activeIcon,
  isActive,
  disabled,
}: {
  path: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  isActive: boolean;
  disabled: boolean;
}) {
  const NavIcon = isActive ? activeIcon : icon;

  return disabled ? (
    <div className="flex flex-col items-center justify-center relative p-2 cursor-not-allowed opacity-50">
      <NavIcon className="h-5 w-5" />
      <span className="text-[10px] mt-1">{label}</span>
    </div>
  ) : (
    <Link
      href={path}
      className="group relative flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-300"
    >
      {/* 그라데이션 활성 상태 배경 */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20"
          layoutId="gradientTab"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      )}
      
      <NavIcon className={cn(
        "h-5 w-5 transition-all duration-300 relative z-10",
        isActive 
          ? "text-purple-600 scale-110" 
          : "text-gray-400 group-hover:text-gray-600"
      )} />
      
      <span className={cn(
        "text-[10px] mt-1 font-medium transition-all duration-300 relative z-10",
        isActive 
          ? "text-purple-600 font-semibold" 
          : "text-gray-500 group-hover:text-gray-700"
      )}>
        {label}
      </span>
    </Link>
  );
}

export const NavBarGradient = forwardRef<HTMLDivElement>((props, ref) => {
  const pathname = usePathname() || "/";
  const { scrollDirection, isAtTop } = useScrollDirection();
  const isVisible = scrollDirection !== "down" || isAtTop;

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300",
      "bg-white border-t border-gray-100",
      "pb-[env(safe-area-inset-bottom)]",
      !isVisible && "translate-y-full"
    )}>
      <div className="w-full px-3">
        <div className="flex justify-around items-center py-2 max-w-md mx-auto" ref={ref}>
          {Object.entries(navItems).map(
            ([path, { label, icon, activeIcon, disabled }]) => (
              <GradientNavItem
                key={path}
                path={path}
                label={label}
                icon={icon}
                activeIcon={activeIcon}
                isActive={pathname === path}
                disabled={disabled}
              />
            )
          )}
        </div>
      </div>
    </nav>
  );
});

// 디자인 옵션 3: 애플 스타일 (심플하고 깔끔한)
function AppleNavItem({
  path,
  icon,
  activeIcon,
  isActive,
  disabled,
}: {
  path: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  isActive: boolean;
  disabled: boolean;
}) {
  const NavIcon = isActive ? activeIcon : icon;

  return disabled ? (
    <div className="flex items-center justify-center relative p-3 cursor-not-allowed opacity-50">
      <NavIcon className="h-6 w-6" />
    </div>
  ) : (
    <Link
      href={path}
      className="group relative flex items-center justify-center p-3 rounded-full transition-all duration-200"
    >
      {/* 애플 스타일 활성 배경 */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gray-100"
          layoutId="appleTab"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}
      
      <NavIcon className={cn(
        "h-6 w-6 transition-all duration-200 relative z-10",
        isActive 
          ? "text-blue-600" 
          : "text-gray-400 group-hover:text-gray-600"
      )} />
    </Link>
  );
}

export const NavBarApple = forwardRef<HTMLDivElement>((props, ref) => {
  const pathname = usePathname() || "/";
  const { scrollDirection, isAtTop } = useScrollDirection();
  const isVisible = scrollDirection !== "down" || isAtTop;

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300",
      "bg-white/60 backdrop-blur-2xl border-t border-gray-200/30",
      "pb-[env(safe-area-inset-bottom)]",
      !isVisible && "translate-y-full"
    )}>
      <div className="w-full">
        <div className="flex justify-around items-center py-1 max-w-xs mx-auto" ref={ref}>
          {Object.entries(navItems).map(
            ([path, { icon, activeIcon, disabled }]) => (
              <AppleNavItem
                key={path}
                path={path}
                icon={icon}
                activeIcon={activeIcon}
                isActive={pathname === path}
                disabled={disabled}
              />
            )
          )}
        </div>
      </div>
    </nav>
  );
});

// 디자인 옵션 4: 머티리얼 디자인 (리플 효과 포함)
function MaterialNavItem({
  path,
  label,
  icon,
  activeIcon,
  isActive,
  disabled,
}: {
  path: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  isActive: boolean;
  disabled: boolean;
}) {
  const NavIcon = isActive ? activeIcon : icon;

  return disabled ? (
    <div className="flex flex-col items-center justify-center relative px-4 py-2 cursor-not-allowed opacity-50">
      <NavIcon className="h-6 w-6" />
      <span className="text-xs mt-1">{label}</span>
    </div>
  ) : (
    <Link
      href={path}
      className={cn(
        "group relative flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 overflow-hidden",
        "hover:bg-gray-50 active:bg-gray-100"
      )}
    >
      {/* 머티리얼 리플 효과 배경 */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-blue-500/10"
          layoutId="materialTab"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      )}
      
      <NavIcon className={cn(
        "h-6 w-6 transition-all duration-200 relative z-10",
        isActive 
          ? "text-blue-600" 
          : "text-gray-500 group-hover:text-gray-700"
      )} />
      
      <span className={cn(
        "text-xs mt-1 font-medium transition-all duration-200 relative z-10",
        isActive 
          ? "text-blue-600 font-semibold" 
          : "text-gray-500 group-hover:text-gray-700"
      )}>
        {label}
      </span>

      {/* 활성 상태 인디케이터 */}
      {isActive && (
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
}

export const NavBarMaterial = forwardRef<HTMLDivElement>((props, ref) => {
  const pathname = usePathname() || "/";
  const { scrollDirection, isAtTop } = useScrollDirection();
  const isVisible = scrollDirection !== "down" || isAtTop;

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300",
      "bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]",
      "pb-[env(safe-area-inset-bottom)]",
      !isVisible && "translate-y-full"
    )}>
      <div className="w-full">
        <div className="flex justify-around items-center h-14 max-w-md mx-auto" ref={ref}>
          {Object.entries(navItems).map(
            ([path, { label, icon, activeIcon, disabled }]) => (
              <MaterialNavItem
                key={path}
                path={path}
                label={label}
                icon={icon}
                activeIcon={activeIcon}
                isActive={pathname === path}
                disabled={disabled}
              />
            )
          )}
        </div>
      </div>
    </nav>
  );
});

// 디자인 옵션 5: 플로팅 + 머티리얼 하이브리드 (떨어진 네비게이션 + 상단 인디케이터)
function FloatingMaterialNavItem({
  path,
  label,
  icon,
  activeIcon,
  isActive,
  disabled,
}: {
  path: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  isActive: boolean;
  disabled: boolean;
}) {
  const NavIcon = isActive ? activeIcon : icon;

  return disabled ? (
    <div className="w-16 flex flex-col items-center justify-center relative p-2 cursor-not-allowed opacity-50">
      <NavIcon className="h-5 w-5" />
      <span className="text-[10px] mt-0.5">{label}</span>
    </div>
  ) : (
    <Link
      href={path}
      className={cn(
        // 고정 너비를 부여하고, 내부 정렬을 위해 px 제거
        "w-16 group relative flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-300 overflow-hidden",
        // 모바일에서는 active만 사용 (터치 시)
        "active:bg-purple-100/70 active:scale-95",
        isActive && "bg-purple-50/90 shadow-md"
      )}
    >
      {/* 머티리얼 스타일 상단 인디케이터 */}
      {isActive && (
        <motion.div
          // 인디케이터 크기와 위치 미세 조정
          className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-[3px] bg-purple-400 rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ 
            duration: 0.4,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
        />
      )}
      
      <NavIcon className={cn(
        // 아이콘 크기 h-6 w-6 -> h-5 w-5 로 조정
        "h-5 w-5 transition-all duration-300 relative z-10",
        isActive 
          // 활성화 시 scale 효과 제거
          ? "text-purple-500" 
          : "text-gray-500"
      )} />
      
      <span className={cn(
        // 텍스트와 아이콘 간격 mt-1 -> mt-0.5 로 조정
        "text-[10px] mt-0.5 font-medium transition-all duration-300 relative z-10",
        isActive 
          ? "text-purple-500 font-semibold" 
          : "text-gray-500"
      )}>
        {label}
      </span>
    </Link>
  );
}

export const NavBarFloatingMaterial = forwardRef<HTMLDivElement>((props, ref) => {
  const pathname = usePathname() || "/";
  const { scrollDirection, isAtTop } = useScrollDirection();
  const isVisible = scrollDirection !== "down" || isAtTop;

  return (
    <div className={cn(
      // 전체 컨테이너 패딩 p-3 -> p-2 로 조정
      "fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]",
      !isVisible && "translate-y-full",
      // Safari elastic 효과를 위한 will-change
      "will-change-transform"
    )}>
      <nav className={cn(
        // 최대 너비를 max-w-sm -> max-w-xs 로 줄임
        "bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] max-w-xs mx-auto border border-gray-200/50",
        // Safari에서 더 부드러운 렌더링
        "transform-gpu"
      )}>
        <div className="flex justify-evenly items-center" ref={ref}>
          {Object.entries(navItems).map(
            ([path, { label, icon, activeIcon, disabled }]) => (
              <FloatingMaterialNavItem
                key={path}
                path={path}
                label={label}
                icon={icon}
                activeIcon={activeIcon}
                isActive={pathname === path}
                disabled={disabled}
              />
            )
          )}
        </div>
      </nav>
    </div>
  );
});

NavBarFloating.displayName = "NavBarFloating";
NavBarGradient.displayName = "NavBarGradient";
NavBarApple.displayName = "NavBarApple";
NavBarMaterial.displayName = "NavBarMaterial";
NavBarFloatingMaterial.displayName = "NavBarFloatingMaterial"; 