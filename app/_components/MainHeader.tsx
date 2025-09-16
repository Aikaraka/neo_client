"use client";

import Search from "@/app/_components/Search";
import TokenBadge from "@/components/common/tokenBadge";
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
import { useState, useEffect } from "react";
import {
  getUserSafeFilterStatus,
  toggleSafeFilter,
} from "@/app/_api/safeFilter.server";
import { useToast } from "@/hooks/use-toast";
import SideBar from "@/components/layout/sidebar";

export default function MainHeader() {
  const user = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [safeFilterEnabled, setSafeFilterEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSafeFilterStatus = async () => {
      const status = await getUserSafeFilterStatus();
      setSafeFilterEnabled(status.safeFilterEnabled);
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
      if (!checked) {
        toast({
          title: "로그인 필요",
          description: "보호필터를 해제하려면 로그인이 필요합니다.",
        });
        // 토글을 원래 상태로 되돌립니다.
        setSafeFilterEnabled(true);
      }
      return;
    }

    // 보호필터를 끄려고 할 때 (checked가 false일 때) 본인인증 여부 확인
    if (!checked) {
      setIsLoading(true);
      const currentStatus = await getUserSafeFilterStatus();
      setIsLoading(false);

      if (!currentStatus.ageVerificationCompleted) {
        toast({
          title: "본인인증 필요",
          description: "보호필터를 해제하려면 본인인증이 필요합니다.",
        });
        router.push("/verify-age");
        // 토글을 원래 상태(ON)로 유지
        setSafeFilterEnabled(true); 
        return;
      }
    }

    // 서버에 토글 요청
    setIsLoading(true);
    const result = await toggleSafeFilter();
    setIsLoading(false);

    if (result.success) {
      setSafeFilterEnabled(result.safeFilterEnabled);
      toast({
        title: result.safeFilterEnabled ? "보호필터 켜짐" : "보호필터 꺼짐",
        description: result.safeFilterEnabled
          ? "선정적인 콘텐츠가 차단됩니다."
          : "모든 콘텐츠를 볼 수 있습니다.",
      });
      router.refresh();
    } else if (result.requiresVerification) {
        toast({
          title: "본인인증 필요",
          description: "보호필터를 해제하려면 본인인증이 필요합니다.",
        });
        router.push("/verify-age");
        setSafeFilterEnabled(true);
    }
  };

  return (
    <header className="z-40 w-full bg-background">
      <div className="w-full max-w-[1160px] mx-auto flex flex-col md:flex-row md:items-start md:justify-end">
        {/* --- 우측 컨트롤 영역 (모바일/데스크톱 공통) --- */}
        {/* 모바일에서는 flex-row, 데스크톱에서는 flex-col items-end */}
        <div className="flex flex-col items-end">
            {/* 상단 행: 사용자 컨트롤 */}
            <div className="flex items-center justify-end w-full h-14 px-4 md:px-0 gap-[23px]">
                {/* 왼쪽 그룹: 보호필터, 토큰 */}
                <div className="flex items-center gap-1 md:space-x-1.5">
                    <div className="flex items-center gap-1 md:space-x-1.5">
                        <Switch
                            id="safe-filter"
                            checked={safeFilterEnabled}
                            onCheckedChange={handleSafeFilterToggle}
                            disabled={isLoading}
                        />
                        <Label htmlFor="safe-filter" className="text-xs text-gray-600">
                            보호필터
                        </Label>
                    </div>
                    {/* 구분선 */}
                    <div className="h-6 w-[1px] bg-[#E6E6E6]" />
                    <TokenBadge />
                </div>

                {/* 오른쪽 그룹: 로그아웃, 사이드바 */}
                {user && (
                    <div className="flex items-center gap-[15px]">
                        {/* 데스크톱 전용 로그아웃 버튼 */}
                        <button
                            onClick={handleLogout}
                            className="hidden md:block text-xs font-medium text-gray-500 hover:text-gray-800"
                        >
                            로그아웃
                        </button>
                        <SideBar />
                    </div>
                )}
            </div>

            {/* 하단 행: 검색창 */}
            <div className="w-full md:w-[281px] mt-2 px-4 md:px-0">
                <Search />
            </div>
        </div>
        
        {/* --- 검색창 (모바일 전용 위치) --- */}
        <div className="px-4 pt-2 md:hidden">
          <Search />
        </div>
      </div>
    </header>
  );
}