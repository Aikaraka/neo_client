"use client";

import { NavBarDesktop, NavBarMobile } from "@/components/layout/navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

export default function ResponsiveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isChatPage = pathname.includes("/chat");

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
          isMobile ? "pl-0" : "pl-[80px]"
        )}
      >
        {children}
      </main>

      {/* --- Mobile Bottom Navbar (only on non-chat pages) --- */}
      {isMobile && !isChatPage && <NavBarMobile />}
    </div>
  );
}
