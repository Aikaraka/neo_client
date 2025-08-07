"use client";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NotFound() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-10 px-8">
      <Frown className="text-primary" size={100} />
      <div className="flex flex-col gap-3 justify-center itmes-center text-center">
        <h1 className="text-5xl text-center">OOPS!</h1>
        <h2>문제가 발생했어요</h2>
        {message && (
          <p className="text-gray-600 text-center max-w-md">
            {message}
          </p>
        )}
      </div>
      <div className="flex justify-center">
        <Link href="/">
          <Button className="hover:opacity-80 hover:bg-primary hover:text-primary-foreground">홈으로</Button>
        </Link>
      </div>
    </div>
  );
}
