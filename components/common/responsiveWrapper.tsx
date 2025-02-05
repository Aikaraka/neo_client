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
    //TODO : 반응형 추가할 때 max-w-full로 변경
    <body
      className={`${
        mobileEnvironMent ? "max-w-md" : "max-w-md"
      }  mx-auto relative`}
    >
      {children}
    </body>
  );
}
