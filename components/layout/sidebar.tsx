"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { signout } from "@/utils/supabase/service/auth";
import { useMutation } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const router = useRouter();
  const { mutate: handleSignout } = useMutation({
    mutationFn: signout,
    onSuccess: () => router.push("/"),
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu />
      </SheetTrigger>
      <SheetContent className="p-0 pt-10 h-screen">
        <div className="flex flex-col justify-between w-full h-full">
          <div>
            <div className="flex justify-between border-b py-6 px-3">
              <SheetTitle className="text-sm">성인 콘텐츠 포함</SheetTitle>
              <Switch />
            </div>
            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link href={"/"}>계정 관리</Link>
              <Link href={"/"}>언어 관리</Link>
            </div>
            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link href={"/"}>고객 지원 센터</Link>
              <Link href={"/"}>공지사항</Link>
            </div>
            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link href={"/"}>서비스 이용 약관</Link>
              <Link href={"/"}>개인정보 처리 방침</Link>
              <Link href={"/"}>저작권 및 지식재산권 관리 정책</Link>
            </div>
          </div>
          <div className="absolute bottom-5 w-full px-5">
            <Button className="w-full" onClick={() => handleSignout()}>
              로그아웃
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
