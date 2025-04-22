import Navbar from "@/components/layout/navbar";
import { ScrollArea } from "@/components/layout/scroll-area";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full h-screen whitespace-nowrap pb-20 relative flex justify-center overflow-x-hidden">
        {children}
        <Navbar />
      </div>
    </>
  );
}
