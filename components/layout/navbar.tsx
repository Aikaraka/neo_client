import { cn } from "@/lib/utils";
import { FC, forwardRef, SVGProps } from "react";

import {
  BoxFilled,
  HomeFilled,
  PencilFilled,
  UserFilled,
  BoxLine,
  HomeLine,
  PencilLine,
  UserLine,
} from "@/public/navbar";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const navItems = {
  "/": {
    label: "홈",
    icon: HomeLine,
    activeIcon: HomeFilled,
    disabled: false,
  },
  "/create": {
    label: "소설 제작",
    icon: PencilLine,
    activeIcon: PencilFilled,
    disabled: false,
  },
  "/storage": {
    label: "보관함",
    icon: BoxLine,
    activeIcon: BoxFilled,
    disabled: false,
  },
  "/mypage": {
    label: "마이페이지",
    icon: UserLine,
    activeIcon: UserFilled,
    disabled: true,
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

      {isActive ? (
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

const Navbar = forwardRef<HTMLDivElement>((props, ref) => {
  const pathname = usePathname() || "/";
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-background border-t">
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
                isActive={pathname.includes(path)}
                disabled={disabled}
              />
            )
          )}
        </div>
      </div>
    </nav>
  );
});
Navbar.displayName = "Navbar";

export default Navbar;
