"use client";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PrevPageButton = React.forwardRef<
  SVGSVGElement,
  React.ComponentPropsWithoutRef<typeof ChevronLeftIcon>
>(({ size, className, ...props }, ref) => {
  const router = useRouter();
  return (
    <ChevronLeftIcon
      className={cn(className, "absolute top-10 left-10 cursor-pointer")}
      ref={ref}
      size={size ?? 40}
      {...props}
      onClick={() => router.back()}
    />
  );
});

PrevPageButton.displayName = "PrevPageButton";

export default PrevPageButton;
