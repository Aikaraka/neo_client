"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { completeAgeVerification } from "@/app/_api/safeFilter.server";
import MainHeader from "@/app/_components/MainHeader";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";

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
          try {
            // 서버 액션을 호출하여 성인 인증 완료 처리
            await completeAgeVerification(rsp.imp_uid);
            
            toast({
              title: "인증 성공",
              description: "성인 인증이 완료되었습니다. 이제 모든 콘텐츠를 이용하실 수 있습니다.",
            });
            
            // 메인 페이지로 이동
            router.push("/");
            router.refresh();
          } catch (error) {
            toast({
              title: "오류",
              description: "인증 정보 저장 중 오류가 발생했습니다.",
              variant: "destructive",
            });
          }
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
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="relative">
            <div className="relative z-10 bg-white rounded-full p-4 w-20 h-20 mx-auto mb-6 shadow-lg">
              <Shield className="h-12 w-12 text-primary mx-auto" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            안전한 여정을 위한 선택
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            NEO의 무한한 이야기 속에서 모든 독자가 편안하게 탐험할 수 있도록, 
            <br className="hidden md:block" />
            <span className="font-semibold text-primary">보호 필터</span>가 여러분을 보호합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">스마트 보호</h3>
            <p className="text-sm text-gray-600">
              콘텐츠를 자동 분석하여 청소년에게 유해한 요소를 감지하고 필터링합니다.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">맞춤형 경험</h3>
            <p className="text-sm text-gray-600">
              각 사용자의 선호도와 연령에 맞는 개인화된 콘텐츠를 제공합니다.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">자유로운 선택</h3>
            <p className="text-sm text-gray-600">
              성인 인증 후에는 모든 콘텐츠에 자유롭게 접근할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-20">
            <div className="w-32 h-32 bg-white rounded-full"></div>
          </div>
          <div className="absolute bottom-0 left-0 transform -translate-x-4 translate-y-4 opacity-10">
            <div className="w-24 h-24 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center">
            
            <h2 className="text-3xl font-bold mb-4">모든 이야기의 문이 열립니다</h2>
            <p className="text-blue-100 mb-8 text-lg max-w-xl mx-auto">
              인증을 통해 NEO의 모든 콘텐츠에 접근하고, 
              <br className="hidden md:block" />
              당신만의 무한한 스토리 여정을 시작하세요.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={handleVerification} 
                size="lg" 
                className="w-full max-w-md h-14 text-lg font-semibold bg-white text-purple-600 hover:bg-gray-100 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                지금 인증하고 모든 이야기 탐험하기
              </Button>
              
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push("/")}
                  className="text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg px-6 py-2"
                >
                  나중에 할게요
                </Button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
} 