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
    <body
      className={`${mobileEnvironMent ? "max-w-md" : "max-w-full"}  mx-auto`}
    >
      {children}
    </body>
  );
}
