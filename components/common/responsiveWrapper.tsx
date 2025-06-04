"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";

export default function ResponsiveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const mobileEnvironMent = useIsMobile();
  return (
    <div
      className={`${
        mobileEnvironMent
          ? "max-w-md min-w-[360px] h-screen"
          : "min-w-[1366px] min-h-[768px] w-screen h-screen flex justify-center pl-24 "
      }  mx-auto relative`}
    >
      {children}
    </div>
  );
}
