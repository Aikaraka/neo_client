"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { completeAgeVerification } from "@/app/_api/safeFilter.server";
import MainHeader from "@/app/_components/MainHeader";

// PortOne(아임포트) 타입 정의
interface IamportCertificationData {
  merchant_uid: string;
  popup?: boolean;
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

declare const IMP: Iamport | undefined;

export default function VerifyAgePage() {
  const router = useRouter();
  const { toast } = useToast();

  /* ---------------- 인증 로직 ---------------- */
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
      { merchant_uid: `mid_verify_${Date.now()}`, popup: true },
      async (rsp) => {
        if (rsp.success) {
          try {
            await completeAgeVerification(rsp.imp_uid);
            toast({ title: "인증 성공", description: "성인 인증이 완료되었습니다." });
            router.push("/");
            router.refresh();
          } catch {
            toast({
              title: "오류",
              description: "인증 정보 저장 중 오류가 발생했습니다.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "인증 실패",
            description: rsp.error_msg,
            variant: "destructive",
          });
        }
      }
    );
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
          <section className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-16 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -left-10 w-52 h-52 bg-white rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-44 h-44 bg-white rounded-full blur-2xl" />
            </div>

            <div className="relative z-10 space-y-5">
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                안전한 여정을 위한 선택
              </h1>
              <p className="text-lg sm:text-xl text-white/90">
                NEO의 모든 콘텐츠를 자유롭게 탐험하기 전, <br className="hidden sm:inline" />
                간단한 <span className="font-semibold">성인 인증</span>이 필요합니다.
              </p>
            </div>
          </section>

          {/* 혜택 카드 */}
          <section className="grid sm:grid-cols-3 gap-6 px-8 py-12">
            <BenefitCard
              title="스마트 보호"
              desc="유해 요소를 자동 감지해 청소년을 보호합니다."
              gradient="from-blue-500 via-sky-400 to-blue-300"
            />
            <BenefitCard
              title="맞춤형 경험"
              desc="연령·선호도 기반 개인화 콘텐츠 제공."
              gradient="from-green-500 via-emerald-400 to-green-300"
            />
            <BenefitCard
              title="자유로운 선택"
              desc="인증 후 모든 콘텐츠에 무제한 접근."
              gradient="from-purple-500 via-violet-400 to-purple-300"
            />
          </section>

          {/* 버튼 영역 */}
          <section className="px-8 pb-14 flex flex-col items-center gap-4">
            <Button
              onClick={handleVerification}
              size="lg"
              className="h-14 w-full max-w-md rounded-full font-semibold text-lg gradient-btn shadow-lg hover:brightness-110"
            >
              지금 인증하고 모든 이야기 탐험하기
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

/* --- 혜택 카드 컴포넌트 --- */
interface BenefitProps {
  title: string;
  desc: string;
  gradient: string; // Tailwind gradient 클래스 조합
}

function BenefitCard({ title, desc, gradient }: BenefitProps) {
  return (
    <div className="relative bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
      {/* 상단 그라디언트 바 */}
      <span
        className={`absolute left-0 top-0 h-1 w-full rounded-t-2xl bg-gradient-to-r ${gradient}`}
      />
      <h3
        className={`mt-4 mb-2 font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
