"use client";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-10 px-8">
      <Frown className="text-primary" size={100} />
      <div className="flex flex-col gap-3 justify-center itmes-center text-center">
        <h1 className="text-5xl text-center">OOPS!</h1>
        <h2>페이지를 찾을 수 없습니다</h2>
      </div>
      <div className="flex justify-center">
        <Link href="/">
          <Button className="hover:opacity-80 hover:bg-primary hover:text-primary-foreground">홈으로</Button>
        </Link>
      </div>
    </div>
  );
}


