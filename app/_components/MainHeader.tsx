"use client";

import Search from "@/app/_components/Search";
import TokenBadge from "@/components/common/tokenBadge";
import { useIsMobile } from "@/hooks/use-mobile";
import { HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/utils/supabase/authProvider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/ui/notification";

export default function MainHeader() {
  const isMobile = useIsMobile();

  if (isMobile) return <MainHeaderMobile />;
  else return <MainHeaderDesktop />;
}

function MainHeaderMobile() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background pb-4">
      <div className="container flex h-14 max-w-md items-center justify-between px-4 gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/neo_emblem.svg" alt="NEO Logo" width={24} height={24} />
          <span className="font-nanum font-extrabold text-lg">NEO</span>
        </Link>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <TokenBadge />
          <NotificationBell />
        </div>
      </div>
      <div className="px-2 pt-2">
        <Search />
      </div>
    </header>
  );
}

function MainHeaderDesktop() {
  const user = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); // 페이지를 새로고침하여 사용자 상태를 업데이트합니다.
  };

  return (
    <header className="w-full bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-end space-y-4">
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-1.5">
                <Switch id="safe-filter" />
                <Label htmlFor="safe-filter" className="text-xs text-gray-600">
                  보호필터
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button>
                        <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        보호 필터를 키면 선정적인 컨텐츠를 차단할 수 있어요.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            <TokenBadge />
            {user && (
              <>
                <NotificationBell />
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 hover:text-gray-800"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
          <div className="w-full max-w-lg">
            <Search />
          </div>
        </div>
      </div>
    </header>
  );
}
