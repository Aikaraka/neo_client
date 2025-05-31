import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-10 px-8">
      <Frown className="text-primary" size={100} />
      <div className="flex flex-col gap-3 justify-center itmes-center text-center">
        <h1 className="text-5xl text-center">OOPS!</h1>
        <h2>문제가 발생했어요</h2>
      </div>
      <Link href="/" className="w-full">
        <Button className="w-full">홈으로</Button>
      </Link>
    </div>
  );
}
