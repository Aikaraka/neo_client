"use client";

import Search from "@/app/_components/Search";
import TokenBadge from "@/components/common/tokenBadge";
import { useIsMobile } from "@/hooks/use-mobile";
import { HelpCircle } from "lucide-react";
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
import { useState, useEffect } from "react";
import { getUserSafeFilterStatus, toggleSafeFilter } from "@/app/_api/safeFilter.server";
import { useToast } from "@/hooks/use-toast";

export default function MainHeader() {
  const isMobile = useIsMobile();

  if (isMobile) return <MainHeaderMobile />;
  else return <MainHeaderDesktop />;
}

function MainHeaderMobile() {
  const user = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [safeFilterEnabled, setSafeFilterEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 상태 로드
  useEffect(() => {
    const loadSafeFilterStatus = async () => {
      if (user) {
        const status = await getUserSafeFilterStatus();
        setSafeFilterEnabled(status.safeFilterEnabled);
      } else {
        // 비로그인 유저는 항상 보호필터 ON
        setSafeFilterEnabled(true);
      }
    };

    loadSafeFilterStatus();
  }, [user]);

  const handleSafeFilterToggle = async (checked: boolean) => {
    if (!user) {
      // 비로그인 유저는 보호필터 해제 불가
      if (!checked) {
        toast({
          title: "로그인 필요",
          description: "보호필터를 해제하려면 로그인이 필요합니다.",
        });
        return;
      }
      return;
    }

    // 보호필터를 끄려고 하는 경우 (checked가 false)
    if (!checked) {
      setIsLoading(true);
      const currentStatus = await getUserSafeFilterStatus();
      setIsLoading(false);

      // 성인 인증이 안 되어 있으면
      if (!currentStatus.isAdult) {
        // UI 상태를 원래대로 되돌림 (보호필터 ON 유지)
        setSafeFilterEnabled(true);

        toast({
          title: "성인 인증 필요",
          description: "보호필터를 해제하려면 성인 인증이 필요합니다.",
        });

        // 성인 인증 페이지로 이동
        router.push("/verify-age");
        return;
      }
    }

    // 성인 인증이 되어 있거나, 보호필터를 켜는 경우
    setIsLoading(true);
    const result = await toggleSafeFilter();
    setIsLoading(false);

    // 상태 업데이트 성공
    setSafeFilterEnabled(result.safeFilterEnabled);
    toast({
      title: result.safeFilterEnabled ? "보호필터 켜짐" : "보호필터 꺼짐",
      description: result.safeFilterEnabled
        ? "선정적인 콘텐츠가 차단됩니다."
        : "모든 콘텐츠를 볼 수 있습니다.",
    });
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background pb-4">
      <div className="w-full max-w-[1160px] mx-auto flex h-14 items-center justify-end px-4 gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Switch 
              id="safe-filter-mobile" 
              checked={safeFilterEnabled}
              onCheckedChange={handleSafeFilterToggle}
              disabled={isLoading}
              className="scale-90"
            />
            <Label htmlFor="safe-filter-mobile" className="text-xs text-gray-600">
              보호필터
            </Label>
          </div>
          <TokenBadge />
          {user && <NotificationBell />}
        </div>
      </div>
      <div className="px-4 pt-2">
        <Search />
      </div>
    </header>
  );
}

function MainHeaderDesktop() {
  const user = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [safeFilterEnabled, setSafeFilterEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 상태 로드
  useEffect(() => {
    const loadSafeFilterStatus = async () => {
      if (user) {
        const status = await getUserSafeFilterStatus();
        setSafeFilterEnabled(status.safeFilterEnabled);
      } else {
        // 비로그인 유저는 항상 보호필터 ON
        setSafeFilterEnabled(true);
      }
    };

    loadSafeFilterStatus();
  }, [user]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleSafeFilterToggle = async (checked: boolean) => {
    if (!user) {
      // 비로그인 유저는 보호필터 해제 불가
      if (!checked) {
        toast({
          title: "로그인 필요",
          description: "보호필터를 해제하려면 로그인이 필요합니다.",
        });
        return;
      }
      return;
    }

    // 보호필터를 끄려고 하는 경우 (checked가 false)
    if (!checked) {
      setIsLoading(true);
      const currentStatus = await getUserSafeFilterStatus();
      setIsLoading(false);

      // 성인 인증이 안 되어 있으면
      if (!currentStatus.isAdult) {
        // UI 상태를 원래대로 되돌림 (보호필터 ON 유지)
        setSafeFilterEnabled(true);

        toast({
          title: "성인 인증 필요",
          description: "보호필터를 해제하려면 성인 인증이 필요합니다.",
        });

        // 성인 인증 페이지로 이동
        router.push("/verify-age");
        return;
      }
    }

    // 성인 인증이 되어 있거나, 보호필터를 켜는 경우
    setIsLoading(true);
    const result = await toggleSafeFilter();
    setIsLoading(false);

    // 상태 업데이트 성공
    setSafeFilterEnabled(result.safeFilterEnabled);
    toast({
      title: result.safeFilterEnabled ? "보호필터 켜짐" : "보호필터 꺼짐",
      description: result.safeFilterEnabled 
        ? "선정적인 콘텐츠가 차단됩니다." 
        : "모든 콘텐츠를 볼 수 있습니다.",
    });
    router.refresh();
  };

  return (
    <header className="w-full bg-background p-4">
      <div className="w-full max-w-[1160px] mx-auto px-4 flex items-start justify-end">

        {/* Right Section: Controls and Search */}
        <div className="flex flex-col items-end space-y-2">
          {/* Top Row: User Controls */}
          <div className="flex items-center  space-x-4">
            <div className="flex items-center space-x-1.5">
              <Switch 
                id="safe-filter" 
                checked={safeFilterEnabled}
                onCheckedChange={handleSafeFilterToggle}
                disabled={isLoading}
              />
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
          {/* Bottom Row: Search Bar */}
          <div className="w-[480px]">
            <Search />
          </div>
        </div>
      </div>
    </header>
  );
}