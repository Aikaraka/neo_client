"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { completeAgeVerification } from "@/app/_api/safeFilter.server";
import MainHeader from "@/app/_components/MainHeader";
import { useEffect, useState } from "react";

// PortOne(아임포트) 타입 정의
interface IamportCertificationData {
  merchant_uid: string;
  popup?: boolean;
  pg?: string; // 예: 'danal'
}

interface IamportCallbackResponse {
  success: boolean;
  imp_uid: string;
  merchant_uid: string;
  error_msg?: string;
}

interface Iamport {
  init: (iamportCode: string) => void;
  certification: (
    data: IamportCertificationData,
    callback: (response: IamportCallbackResponse) => void
  ) => void;
}

declare global {
  interface Window {
    IMP?: Iamport;
  }
}

export default function VerifyAgePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPortOneReady, setIsPortOneReady] = useState(false);

  // PortOne SDK 로드
  useEffect(() => {
    const loadPortOneSDK = () => {
      // 이미 로드되어 있는지 확인
      if (window.IMP) {
        console.log("PortOne SDK 이미 로드됨");
        setIsPortOneReady(true);
        return;
      }

      // 스크립트가 이미 로드 중인지 확인
      const existingScript = document.querySelector('script[src*="browser-sdk.js"]');
      if (existingScript) {
        console.log("PortOne SDK 스크립트 이미 존재, 초기화 대기...");
        // 스크립트는 있지만 window.IMP가 없는 경우, 잠시 대기 후 다시 확인
        setTimeout(() => {
          if (window.IMP) {
            console.log("PortOne SDK 초기화 완료!");
            setIsPortOneReady(true);
          } else {
            console.log("스크립트는 있지만 window.IMP가 없음, 재로드 시도");
            // 기존 스크립트 제거 후 재로드
            (existingScript as HTMLScriptElement).remove();
            loadPortOneSDK();
          }
        }, 1000);
        return;
      }

      console.log("PortOne SDK 수동 로드 시작");
      
      // 스크립트 동적 로드
      const script = document.createElement('script');
      // 다른 CDN URL 시도
      script.src = 'https://code.jquery.com/jquery-1.12.4.min.js'; // 임시로 jQuery 테스트
      script.async = true;
      
      script.onload = () => {
        console.log("jQuery 로드 완료, 이제 PortOne SDK 로드");
        // jQuery 로드 후 PortOne SDK 로드
        const portoneScript = document.createElement('script');
        portoneScript.src = 'https://cdn.iamport.kr/v1/iamport.js';
        portoneScript.async = true;
        
        portoneScript.onload = () => {
          console.log("PortOne SDK 로드 완료!");
          setTimeout(() => {
            if (window.IMP) {
              console.log("window.IMP 확인됨:", window.IMP);
              setIsPortOneReady(true);
            } else {
              console.error("window.IMP가 여전히 undefined");
              // 다시 한 번 시도
              setTimeout(() => {
                if (window.IMP) {
                  console.log("지연 후 window.IMP 확인됨");
                  setIsPortOneReady(true);
                } else {
                  console.error("최종적으로 window.IMP 로드 실패");
                }
              }, 2000);
            }
          }, 500);
        };
        
        portoneScript.onerror = () => {
          console.error("PortOne SDK 로드 실패!");
        };
        
        document.head.appendChild(portoneScript);
      };
      
      script.onerror = () => {
        console.error("jQuery 로드 실패!");
      };
      
      document.head.appendChild(script);
    };

    // 즉시 로드 시도
    loadPortOneSDK();

    // 3초 후에도 로드되지 않으면 재시도
    const timeout = setTimeout(() => {
      if (!window.IMP) {
        console.log("3초 후 재시도");
        loadPortOneSDK();
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  /* ---------------- 인증 로직 ---------------- */
  const handleVerification = () => {
    console.log("인증 버튼 클릭됨");
    console.log("isPortOneReady:", isPortOneReady);
    console.log("window.IMP:", window.IMP);

    if (!isPortOneReady || !window.IMP) {
      toast({
        title: "오류",
        description: "본인인증 모듈을 불러오는 데 실패했습니다. 페이지를 새로고침해주세요.",
        variant: "destructive",
      });
      return;
    }

    const impCode = process.env.NEXT_PUBLIC_PORTONE_CODE;
    console.log("impCode:", impCode);
    
    if (!impCode) {
      toast({
        title: "오류",
        description: "가맹점 식별코드가 설정되지 않았습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("PortOne 초기화 시작");
      window.IMP.init(impCode);
      console.log("PortOne 초기화 완료");
      
      window.IMP.certification(
        { 
          merchant_uid: `mid_verify_${Date.now()}`, 
          popup: true,
          pg: 'danal'
        },
        async (rsp) => {
          console.log("인증 결과:", rsp);
          if (rsp.success) {
            try {
              await completeAgeVerification(rsp.imp_uid);
              toast({ title: "인증 성공", description: "성인 인증이 완료되었습니다." });
              const to = "/";
              router.push(to);
              router.refresh();
            } catch (error) {
              console.error("인증 처리 오류:", error);
              toast({
                title: "오류",
                description: "인증 정보 저장 중 오류가 발생했습니다.",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "인증 실패",
              description: rsp.error_msg || "본인인증에 실패했습니다.",
              variant: "destructive",
            });
          }
        }
      );
    } catch (error) {
      console.error("PortOne 초기화 오류:", error);
      toast({
        title: "오류",
        description: "본인인증 초기화에 실패했습니다.",
        variant: "destructive",
      });
    }
  };
  /* ------------------------------------------ */

  return (
    <div className="min-h-screen bg-background relative">
      {/* 흐림 배경 */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-200 via-blue-200 to-slate-200" />
      <div className="absolute inset-0 -z-10 backdrop-blur-xl" />

      <MainHeader />

      {/* 중앙 카드 */}
      <div className="flex justify-center mt-16 px-4">
        <div className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl bg-white/70 backdrop-blur-lg ring-1 ring-black/10">
          {/* 헤더 배너 */}
          <section className="relative bg-slate-900/80 text-white px-10 py-12 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -left-10 w-52 h-52 bg-white rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-44 h-44 bg-white rounded-full blur-2xl" />
            </div>

            <div className="relative z-10 space-y-5">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                보호 필터 해제
              </h1>
            </div>
          </section>

          {/* 버튼 영역 */}
          <section className="px-8 pt-12 pb-14 flex flex-col items-center gap-4">
            <p className="text-center text-lg text-gray-500 sm:text-xl mb-4">
                NEO의 모든 콘텐츠를 자유롭게 탐험하기 전, <br className="hidden sm:inline" />
                간단한 <span className="font-semibold text-gray-700">성인 인증</span>이 필요합니다.
             </p>
            <Button
              onClick={handleVerification}
              disabled={!isPortOneReady}
              size="lg"
              className="h-14 w-full max-w-md rounded-full font-semibold text-lg gradient-btn shadow-lg hover:brightness-110 disabled:opacity-50"
            >
              {isPortOneReady ? "지금 인증하고 모든 이야기 탐험하기" : "인증 모듈 로딩 중..."}
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              나중에 할게요
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
