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
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = {
  "/": {
    label: "홈",
    icon: HomeLine,
    activeIcon: HomeFilled,
    disabled: false,
  },
  "/storage": {
    label: "보관함",
    icon: BoxLine,
    activeIcon: BoxFilled,
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
}: {
  path: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  activeIcon: FC<SVGProps<SVGSVGElement>>;
  isActive: boolean;
  disabled: boolean;
}) {
  const isMobile = useIsMobile();
  const NavIcon = isActive ? activeIcon : icon;

  return disabled ? (
    <div className="flex flex-col items-center justify-center relative p-2 cursor-not-allowed opacity-50">
      <NavIcon className="h-6 w-6" />
      <span className="text-xs mt-1">{label}</span>
    </div>
  ) : (
    <Link
      key={path}
      href={path}
      className={cn(
        "flex flex-col items-center justify-center relative p-2",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
      data-tab={label.toLowerCase().replace(" ", "-")}
      aria-disabled={disabled}
    >
      <NavIcon className="h-6 w-6" />
      <span className="text-xs mt-1">{label}</span>

      {isActive && isMobile ? (
        <motion.div
          className="absolute h-1 bottom-0 rounded-lg w-full bg-primary dark:bg-gradient-to-r from-transparent to-primary"
          layoutId="sidebar"
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
          }}
        />
      ) : null}
    </Link>
  );
}

const NavBarMobile = forwardRef<HTMLDivElement>((props, ref) => {
  const pathname = usePathname() || "/";
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-background border-b z-30">
      <div className="container max-w-md">
        <div
          className="flex justify-around items-center py-2 relative"
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

const NavBarDesktop = forwardRef<HTMLDivElement>((props, ref) => {
  const pathname = usePathname() || "/";
  return (
    <nav className="fixed flex flex-col left-0 top-0 bg-background border-b z-50 w-[89px] min-h-[768px] h-full shadow-lg items-center py-6 gap-4 px-3 rounded-3xl">
      <Image src="/neo_emblem.svg" alt="NEO Logo" width={50} height={50} />
      <div className="container max-w-md">
        <div
          className="flex flex-col justify-around items-center border-t py-2 relative"
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
NavBarDesktop.displayName = "NavBarDesktop";

const Navbar = () => {
  const isMobile = useIsMobile();
  return isMobile ? <NavBarMobile /> : <NavBarDesktop />;
};
Navbar.displayName = "Navbar";

export default Navbar;
