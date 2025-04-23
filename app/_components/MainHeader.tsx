"use client";

import Search from "@/app/_components/Search";
// import TokenBadge from "@/components/common/tokenBadge";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import Link from "next/link";

export default function MainHeader() {
  const isMobile = useIsMobile();

  if (isMobile) return <MainHeaderMobile />;
  else return <MainHeaderDesktop />;
}

function MainHeaderMobile() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 max-w-md items-center justify-between px-4 gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/neo_emblem.svg" alt="NEO Logo" width={24} height={24} />
          <span className="font-semibold text-xl">NEO</span>
        </Link>
        <div className="flex items-center gap-1 flex-1">
          {/* <TokenBadge /> */}
          <Search />
        </div>
      </div>
    </header>
  );
}
function MainHeaderDesktop() {
  return (
    <header className="flex flex-end w-full bg-background p-10 box-border">
      <div className="flex-1" />
      <Search />
    </header>
  );
}
