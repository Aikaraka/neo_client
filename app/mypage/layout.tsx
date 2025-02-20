import Navbar from "@/components/layout/navbar";
import { ScrollArea } from "@/components/layout/scroll-area";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollArea
        aria-orientation="vertical"
        className="w-full h-screen whitespace-nowrap pb-20"
      >
        {children}
      </ScrollArea>
      <Navbar />
    </>
  );
}
