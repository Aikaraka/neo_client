"use client";

import { Button } from "@/components/ui/button";
import { MainContent } from "@/components/ui/content";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// PortOne(아임포트)의 타입 정의가 필요합니다. 우선 any로 처리합니다.
declare const IMP: any;

export default function VerifyAgePage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleVerification = () => {
    if (!IMP) {
      toast({
        title: "오류",
        description: "본인인증 모듈을 불러오는 데 실패했습니다.",
        variant: "destructive",
      });
      return;
    }
    
    const impCode = process.env.NEXT_PUBLIC_PORTONE_CODE;
    if (!impCode) {
      toast({
        title: "오류",
        description: "가맹점 식별코드가 설정되지 않았습니다.",
        variant: "destructive",
      });
      return;
    }

    IMP.init(impCode);

    IMP.certification(
      {
        merchant_uid: `mid_verify_${new Date().getTime()}`,
        popup: true, // 팝업으로 인증창을 띄웁니다.
      },
      async (rsp: any) => {
        if (rsp.success) {
          // *** 중요 ***
          // 여기서 서버로 rsp.imp_uid를 보내, 서버에서 다시 한번 인증 유효성을 검증하고
          // 그 결과를 DB에 저장하는 '서버 액션'을 호출해야 합니다.
          console.log("인증 성공:", rsp);
          // 예: await updateUserAgeVerification(rsp.imp_uid);
          
          toast({
            title: "인증 성공",
            description: "본인인증이 완료되었습니다. 잠시 후 이동합니다.",
          });
          router.push("/");
        } else {
          toast({
            title: "인증 실패",
            description: `인증에 실패했습니다: ${rsp.error_msg}`,
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <MainContent className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 p-6 border rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">성인인증이 필요합니다</h1>
          <p className="text-gray-600 dark:text-gray-400">
              안전한 서비스 이용을 위해, 최초 1회 본인인증을 통한
              성인인증이 필요합니다.
          </p>
          <Button onClick={handleVerification} size="lg" className="w-full mt-4">
              본인인증하기
          </Button>
      </div>
    </MainContent>
  );
} 