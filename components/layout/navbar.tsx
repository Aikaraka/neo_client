"use client";

import { cn } from "@/lib/utils";
import { FC, forwardRef, SVGProps } from "react";

import {
  BoxFilled,
  HomeFilled,
  UserFilled,
  BoxLine,
  HomeLine,
  UserLine,
} from "@/public/navbar";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { PencilLine, Plus } from "lucide-react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

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
    label: "세계관\n 제작",
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

function NavItem({
  path,
  label,
  icon,
  activeIcon,
  isActive,
  disabled,
  isDesktop = false,
}: {
  path: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  isActive: boolean;
  disabled: boolean;
  isDesktop?: boolean;
}) {
  const NavIcon = isActive ? activeIcon : icon;

  // 데스크톱과 모바일에 따른 크기 설정
  const iconSize = isDesktop ? "h-6 w-6" : "h-5 w-5";
  const containerSize = isDesktop ? "h-7 w-7" : "h-6 w-6";
  const textSize = isDesktop ? "text-[11px]" : "text-[10px]";
  const padding = isDesktop ? "p-3" : "p-2";

  return disabled ? (
    <div className={cn(
      "flex flex-col items-center justify-center relative cursor-not-allowed opacity-50",
      padding
    )}>
      <div className={cn("flex items-center justify-center", containerSize)}>
        <NavIcon className={iconSize} />
      </div>
      <span className={cn(textSize, "mt-1")}>{label}</span>
    </div>
  ) : (
    <Link
      key={path}
      href={path}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300",
        isDesktop ? "px-4 py-3" : "px-3 py-2"
      )}
      data-tab={label.toLowerCase().replace(" ", "-")}
      aria-disabled={disabled}
    >
      {/* 활성 상태 배경 */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20"
          layoutId={isDesktop ? "activeTabDesktop" : "activeTab"}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      )}
      
      <div className={cn(
        "relative flex items-center justify-center transition-all duration-300",
        containerSize,
        isActive && "transform scale-110"
      )}>
        <NavIcon className={cn(
          iconSize,
          "transition-colors duration-300",
          isActive 
            ? "text-purple-600" 
            : "text-gray-400 group-hover:text-gray-600"
        )} />
      </div>
      
      <span className={cn(
        "relative mt-1 font-medium transition-all duration-300 whitespace-pre-line text-center leading-tight",
        textSize,
        isActive 
          ? "text-purple-600 font-semibold" 
          : "text-gray-500 group-hover:text-gray-700"
      )}>
        {label}
      </span>
      
      {/* 활성 상태 점 표시 */}
      {isActive && (
        <motion.div
          className="absolute -bottom-1 w-1 h-1 bg-purple-600 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
}

export const NavBarMobile = forwardRef<HTMLDivElement>((props, ref) => {
  const pathname = usePathname() || "/";
  const { scrollDirection, isAtTop } = useScrollDirection();
  const isVisible = scrollDirection !== "down" || isAtTop;

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t z-30 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300",
      !isVisible && "translate-y-full"
    )}>
      {/* 상단 장식 라인 */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      
      <div className="w-full px-2">
        <div
          className="flex justify-around items-center py-1 max-w-md mx-auto"
          ref={ref}
        >
          {Object.entries(navItems).map(
            ([path, { label, icon, activeIcon, disabled }]) => (
              <NavItem
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
NavBarMobile.displayName = "NavBarMobile";

export const NavBarDesktop = forwardRef<HTMLDivElement>((props, ref) => {
  const pathname = usePathname() || "/";
  return (
    <nav className="flex flex-col bg-white border-b z-50 w-[80px] min-h-[768px] h-full shadow-lg items-center gap-4 py-4 rounded-3xl">
      <Image src="/neo_emblem.svg" alt="NEO Logo" width={50} height={50} />
      <div className="container max-w-md">
        <div
          className="flex flex-col items-center border-t py-4 relative gap-3"
          ref={ref}
        >
          {Object.entries(navItems).map(
            ([path, { label, icon, activeIcon, disabled }]) => (
              <NavItem
                key={path}
                path={path}
                label={label}
                icon={icon}
                activeIcon={activeIcon}
                isActive={pathname === path}
                disabled={disabled}
                isDesktop={true}
              />
            )
          )}
        </div>
      </div>
    </nav>
  );
});
NavBarDesktop.displayName = "NavBarDesktop";
