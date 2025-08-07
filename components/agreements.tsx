import Link from "next/link";

export const TermsOfServiceAgreement = () => {
  return (
    <div className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto p-4">
      <h1 className="text-2xl font-bold">이용약관</h1>
      <div className="bg-white rounded-lg">
        <h2 className="text-2xl font-bold mt-8 mb-4">제1장 총칙</h2>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제1조 (목적)</h3>
        <p className="text-gray-700 mb-4">
          이 약관은 주식회사 더퍼레이드(이하 &quot;회사&quot;)가 제공하는 NEO 서비스 및 관련 제반 서비스(이하 통칭하여 &quot;서비스&quot;)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제2조 (용어의 정의)</h3>
        <p className="text-gray-700 mb-4">
          이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">&quot;서비스&quot;라 함은 회사가 제공하는 웹사이트, 애플리케이션 등 유·무선 기기를 통해 회원이 AI 기반의 인터랙티브 소설을 생성하고 이용할 수 있도록 하는 &apos;NEO&apos; 및 관련 제반 서비스를 의미합니다.</li>
          <li className="mb-2">&quot;회원&quot;이라 함은 본 약관 및 회사의 <strong>[개인정보처리방침]</strong>에 동의하고 회사로부터 서비스 이용 자격을 부여받은 자를 의미합니다.</li>
          <li className="mb-2">&quot;계정(ID)&quot;이라 함은 회원의 식별과 서비스 이용을 위하여 회원이 사용하는 이메일 주소를 의미합니다.</li>
          <li className="mb-2">&quot;콘텐츠&quot;라 함은 회원이 서비스를 이용하는 과정에서 입력한 프롬프트, 설정값, 그리고 이를 통해 생성된 AI 생성물을 포함하여, 서비스 내에서 사용되는 모든 부호, 문자, 이미지, 스토리, 캐릭터 등 일체의 정보를 의미합니다.</li>
          <li className="mb-2">&quot;토큰&quot;이라 함은 회원이 서비스 내 유료 기능을 이용하기 위해 구매하는 가상의 재화를 의미합니다.</li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제3조 (약관의 명시, 효력 및 변경)</h3>
        <p className="text-gray-700 mb-4">
          ① 회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면 또는 별도의 연결 화면에 게시합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 회사는 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 그 적용일자 7일 전부터 적용일자 전일까지 서비스 내에 공지합니다. 다만, 회원에게 불리하게 약관 내용을 변경하는 경우에는 최소 30일 이상의 유예기간을 두고 공지하며, 이메일 등 가능한 수단으로 회원에게 개별 통지합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ④ 회사가 전항에 따라 공지하면서 회원에게 적용일자 전일까지 거부의사를 표시하지 않으면 동의의 의사표시가 표명된 것으로 본다는 뜻을 명확하게 고지하였음에도, 회원이 명시적으로 거부의사를 표시하지 아니한 경우 개정약관에 동의한 것으로 봅니다.
        </p>
        <p className="text-gray-700 mb-4">
          ⑤ 회원은 개정 약관에 동의하지 않을 경우, 적용일자 전일까지 거부의사를 표시하고 이용계약을 해지(회원 탈퇴)할 수 있습니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제4조 (관련 정책과의 관계)</h3>
        <p className="text-gray-700 mb-4">
          ① 회사는 서비스의 구체적인 이용 방법, 콘텐츠 제작 및 이용 기준 등에 관하여 별도의 <strong>[콘텐츠 규정]</strong>을 둘 수 있습니다. 해당 규정은 이 약관의 일부를 구성하며, 회원은 본 약관에 동의함으로써 해당 규정을 준수할 것에 동의한 것으로 봅니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 이 약관에서 정하지 아니한 사항이나 해석에 관하여는 [콘텐츠 규정], [개인정보처리방침] 등 개별 정책 및 관계 법령 또는 상관례에 따릅니다.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">제2장 이용계약</h2>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제5조 (이용계약의 체결 및 제한)</h3>
        <p className="text-gray-700 mb-4">
          ① 이용계약은 서비스를 이용하고자 하는 자가 회사가 정한 가입 절차에 따라 이 약관의 내용에 동의한 후 이용신청을 하고, 회사가 이러한 신청을 승낙함으로써 체결됩니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 회원은 가입 시 정확하고 최신 정보를 제공해야 합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2">허위의 정보를 기재하거나, 타인의 명의를 도용한 경우</li>
          <li className="mb-2">토큰 구매 대금을 납부하지 않거나 잘못 납부하여 확인이 불가능한 경우</li>
          <li className="mb-2">최근 3개월 내 본 약관 위반으로 이용제한 기록이 있거나 영구 이용제한을 받은 경우</li>
          <li className="mb-2">만 14세 미만인 경우</li>
          <li className="mb-2">기타 이 약관에 위반되거나 위법 또는 부당한 이용신청임이 확인된 경우</li>
        </ol>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제6조 (회원 계정의 관리 책임)</h3>
        <p className="text-gray-700 mb-4">
          ① 회원의 계정 및 비밀번호에 관한 관리 책임은 회원 본인에게 있으며, 이를 제3자에게 이용하게 해서는 안 됩니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 회원은 자신의 계정이 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 이를 즉시 회사에 통지하여야 합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 회원은 자신의 계정에서 발생하는 모든 활동에 대해 책임을 집니다.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">제3장 서비스 이용</h2>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제7조 (서비스의 내용 및 변경)</h3>
        <p className="text-gray-700 mb-4">
          ① 회사는 회원에게 AI 기술을 활용한 인터랙티브 소설 생성 및 플레이 서비스를 제공하며, 세부적인 내용은 다음과 같습니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2">AI 소설 플랫폼 서비스</li>
          <li className="mb-2">토큰 구매 및 사용 제도</li>
          <li className="mb-2">콘텐츠 등급에 따른 접근 제한 기능</li>
        </ol>
        <p className="text-gray-700 mb-4">
          ② 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신 두절 또는 운영상 상당한 이유가 있는 경우 서비스 제공을 일시적으로 중단할 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 회사는 새로운 서비스로의 교체 등 경영상 또는 기술상 필요에 따라 현재 제공되는 서비스의 전부 또는 일부를 변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다. 서비스가 완전히 중단될 경우, 제15조 제3항에 따라 환불 절차를 진행합니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제8조 (회원의 의무 및 금지행위)</h3>
        <p className="text-gray-700 mb-4">
          ① 회원은 관계 법령, 이 약관의 규정, 회사가 정한 [콘텐츠 규정] 및 기타 공지사항 등을 준수하여야 하며, 다음 각 호의 행위를 하여서는 안 됩니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2">미성년자를 성적으로 묘사하거나 대상화하는 콘텐츠를 생성하는 행위</li>
          <li className="mb-2">동의 없는 관계, 성범죄 등 강압적이거나 착취적인 설정을 포함한 콘텐츠를 생성하는 행위</li>
          <li className="mb-2">과도한 폭력 또는 혐오, 차별을 조장하는 콘텐츠를 생성하는 행위</li>
          <li className="mb-2">실존 인물에 대한 명예훼손 또는 허위사실을 유포할 수 있는 콘텐츠를 생성하는 행위</li>
          <li className="mb-2">타인의 저작권, 초상권 등 지식재산권 및 기타 권리를 침해하는 콘텐츠를 생성하는 행위</li>
          <li className="mb-2">기타 <strong>[콘텐츠 규정]</strong>에서 금지하는 행위</li>
        </ol>
        <p className="text-gray-700 mb-4">
          ② 회사는 회원이 제1항의 금지행위를 하는 경우, 제16조에 따라 이용을 제한할 수 있습니다.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">제4장 콘텐츠 및 지식재산권</h2>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제9조 (콘텐츠에 대한 권리 귀속)</h3>
        <p className="text-gray-700 mb-4">
          ① 회원이 서비스에 입력한 프롬프트, 설정 등 회원의 창작적 기여가 인정되는 부분에 대한 저작권은 회원에게 귀속됩니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 회원이 서비스를 통해 생성한 &quot;AI 생성물&quot;은 현행 법령상 권리 귀속이 불명확할 수 있으므로, 회사는 AI 생성물 자체에 대한 저작권을 주장하지 않습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 제1항 및 제2항에도 불구하고, 회원이 플랫폼 내 기능을 통해 소설, 캐릭터 등을 &apos;공개 설정&apos;하는 경우, 다른 회원은 이를 개인적 이용 범위 내에서 사용하거나 파생 콘텐츠를 생성할 수 있는 비독점적 이용 권한을 가집니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제10조 (AI 생성 콘텐츠의 한계와 회원의 책임)</h3>
        <p className="text-gray-700 mb-4">
          ① 회사는 AI 모델의 기술적 특성상 생성된 콘텐츠의 결과물이 예측 불가능하며, 그 내용의 진실성, 정확성, 완전성, 품질 및 타인의 권리 비침해성을 보증하지 않습니다. 이는 시스템 상 하자가 아니므로 환불이 불가능합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② AI 생성물의 이용으로 인해 발생하는 모든 저작권 분쟁 및 법적 문제에 대한 책임은 해당 콘텐츠를 생성하고 이용한 회원에게 있습니다. 회원은 자신이 입력하고 생성한 콘텐츠가 타인의 권리를 침해하지 않음을 보증하며, 이로 인해 발생하는 모든 분쟁과 손해에 대해 회사를 면책하고 직접 해결해야 합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 회원의 개인정보 보호를 위해, 회사는 사용자가 서비스 이용 중 유저가 입력하는 값을 저장하지 않습니다. 단, AI가 생성한 응답값은 서비스의 연속적인 이용(이전 대화 불러오기 등)을 위해 저장됩니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제11조 (회원의 라이선스 부여)</h3>
        <p className="text-gray-700 mb-4">
          ① 회원은 자신이 서비스 이용 중 생성하거나 게시한 콘텐츠(설정, AI 생성물 포함)를 회사가 다음 각 호의 목적 범위 내에서 사용할 수 있도록, 전 세계적이고, 무상이며, 비독점적인 라이선스를 부여합니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2">서비스의 제공, 운영, 개선 및 신규 서비스 개발</li>
          <li className="mb-2">기술 연구 및 데이터 분석</li>
          <li className="mb-2">마케팅 및 홍보 활용 (예: 예시 콘텐츠, 썸네일 등)</li>
        </ol>
        <p className="text-gray-700 mb-4">
          ② 제1항에 따른 라이선스 사용에는 콘텐츠의 저장, 복제, 수정, 공중 송신, 전시, 배포, 2차적 저작물 작성 등이 포함될 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 본 조에 따른 라이선스는 회원이 탈퇴하거나 서비스가 종료된 이후에도 유효하게 존속됩니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제12조 (회사의 지식재산권)</h3>
        <p className="text-gray-700 mb-4">
          서비스 자체의 디자인, 텍스트, 스크립트, 그래픽, UI 등 회사가 작성한 저작물에 대한 저작권 및 기타 지식재산권은 회사에 귀속됩니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제13조 (권리 침해 시 조치)</h3>
        <p className="text-gray-700 mb-4">
          회사는 저작권법 제103조에 따라 복제·전송 중단 요청을 받은 경우, 즉시 해당 콘텐츠의 서비스 제공을 중단하거나 삭제하는 조치를 취할 수 있습니다.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">제5장 유료서비스 및 결제</h2>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제14조 (토큰 및 결제)</h3>
        <p className="text-gray-700 mb-4">
          ① 회원은 서비스 내에서 토큰을 구매하여 유료 기능을 이용할 수 있습니다. 토큰의 가격 및 결제 조건은 서비스 내 별도 페이지에 고지합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 결제는 회사가 지정한 결제 제공업체를 통해 처리되며, 회사는 사전 공지 후 토큰 가격을 변경할 권리를 보유합니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제15조 (청약철회 및 환불)</h3>
        <p className="text-gray-700 mb-4">
          ① 회원이 구매한 토큰을 전혀 사용하지 아니하였을 경우, 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 결제일로부터 7일 이내에 청약철회를 할 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 제10조 제1항에 따라 서비스에 대한 불만족으로 사용된 토큰은 환불이 불가능합니다. 단, 시스템의 중대한 하자로 인한 환불은 neoyourscene@gmail.com으로 문의 후 회사의 내부 절차에 따라 가능할 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 서비스가 회사의 귀책사유로 완전히 중단될 경우, 중단 공지일 기준 3개월 이내에 결제된 건에 한하여 사용하지 않은 유료 토큰은 환불받을 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ④ 유료 토큰은 구매일로부터 1년간 유효하며, 유효기간이 경과한 토큰은 자동 소멸되며 환불되지 않습니다.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">제6장 계약해지 및 이용제한</h2>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제16조 (이용제한 및 제재 조치)</h3>
        <p className="text-gray-700 mb-4">
          ① 회사는 회원이 이 약관 제8조를 위반하는 등 약관상의 의무를 이행하지 않는 경우, 위반 행위의 경중과 반복 여부 등을 고려하여 다음 각 호와 같이 단계적으로 이용을 제한할 수 있습니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2">1단계 (경고 및 콘텐츠 조치): 콘텐츠 비공개 또는 삭제 및 경고 메시지 발송</li>
          <li className="mb-2">2단계 (일시 이용 제한): 3일에서 30일간 계정 이용 정지</li>
          <li className="mb-2">3단계 (영구 이용 제한): 계정 삭제 및 영구적인 서비스 접근 차단</li>
        </ol>
        <p className="text-gray-700 mb-4">
          ② 회사는 제1항의 조치를 취하기 전에 회원에게 그 사유를 통지하고 소명의 기회를 부여할 수 있습니다. 다만, 명백한 법령 위반이나 타인의 권리에 대한 중대한 침해가 발생하는 등 긴급한 조치가 필요한 경우에는 사후에 통지할 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 범죄 행위와 관련이 있다고 판단되는 경우, 회사는 수사기관에 관련 정보를 제공하는 등 법적 조치를 취할 수 있습니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제17조 (이용계약 해지)</h3>
        <p className="text-gray-700 mb-4">
          ① 회원은 언제든지 서비스 내 기능을 통해 이용계약을 해지(회원 탈퇴)할 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 회원이 제16조 제1항 제3호에 따라 영구 이용 제한 조치를 받은 경우, 회사는 직권으로 이용계약을 해지할 수 있습니다.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">제7장 기타</h2>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제18조 (손해배상 및 면책)</h3>
        <p className="text-gray-700 mb-4">
          ① 회사 또는 회원이 본 약관의 규정을 위반하여 상대방에게 손해를 입힌 경우, 그 손해를 배상할 책임이 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 회사는 다음 각 호의 사유로 인하여 발생한 손해에 대하여는 책임을 지지 않습니다. 단, 회사의 고의 또는 중대한 과실이 있는 경우는 예외로 합니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2">천재지변 또는 이에 준하는 불가항력 상태로 서비스를 제공할 수 없는 경우</li>
          <li className="mb-2">회원의 귀책사유로 인한 서비스 이용의 장애</li>
          <li className="mb-2">회원이 생성하거나 게시한 콘텐츠의 내용 및 그로 인해 발생하는 법적 분쟁</li>
          <li className="mb-2">무료로 제공되는 서비스의 이용과 관련하여 발생한 손해</li>
        </ol>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제19조 (준거법 및 재판관할)</h3>
        <p className="text-gray-700 mb-4">
          ① 회사와 회원 간에 제기된 소송에는 대한민국 법을 준거법으로 합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 회사와 회원 간 발생한 분쟁에 관한 소송은 민사소송법상의 관할을 가지는 법원에 제기합니다.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">부칙</h2>
        <p className="text-gray-700 mb-4">
          시행일자: 2025년 8월 7일
        </p>
      </div>
    </div>
  );
};

export const CopyrightTerm = () => {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">콘텐츠 규정</h1>
      <p>
        자세한 내용은 아래 링크에서 확인하실 수 있습니다.
      </p>
      <Link href="/terms/copyright" target="_blank" className="text-blue-500 hover:underline">
        콘텐츠 규정 전문 보기
      </Link>
    </div>
  );
};

export const MarketingAgreement = () => {
  return (
    <div className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto p-4">
      <h1 className="text-2xl font-bold">마케팅 정보 수신 및 활용 동의 약관</h1>
      <p className="text-gray-700 mb-4 font-semibold">최종 업데이트: 2025년 8월 5일</p>

      <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제1조 (목적)</h3>
      <p className="text-gray-700 mb-4">
        본 약관은 주식회사 더퍼레이드(이하 “회사”)가 이용자에게 푸시 알림, 이메일, 문자메시지 등 다양한 채널을 통해 맞춤형 마케팅 정보 및 프로모션 관련 콘텐츠를 제공하기 위해, 관련 정보의 수집 및 이용에 대한 동의를 얻기 위한 절차를 규정함을 목적으로 합니다.
      </p>

      <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제2조 (수집 항목 및 이용 목적)</h3>
      <p className="text-gray-700 mb-4">
        회사는 본 약관에 따라 아래와 같은 항목을 수집하고, 명시된 목적 범위 내에서 이용합니다.
      </p>
      <ol className="list-decimal pl-6 text-gray-700 mb-4">
        <li className="mb-2"><strong>수집 항목:</strong> 디바이스 식별자(ID), 푸시 알림 토큰, 앱 고유 식별정보, 이메일 주소, 전화번호, 서비스 이용 내역 및 활동 기록 등</li>
        <li className="mb-2">
          <strong>이용 목적:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li className="mb-1">맞춤형 마케팅 콘텐츠, 이벤트, 서비스 및 상품 정보의 제공</li>
            <li className="mb-1">이용자의 관심 기반 프로모션 안내 및 광고 노출 최적화</li>
            <li className="mb-1">이벤트 참여 유도, 뉴스레터 발송, 기능 업데이트 안내 등</li>
          </ul>
        </li>
      </ol>
      <p className="text-gray-700 mb-4">
        단, 이메일 주소와 전화번호는 이용자가 자발적으로 입력한 경우에만 수집되며, 동의하지 않아도 서비스의 본질적 이용에는 지장이 없습니다.
      </p>

      <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제3조 (보유 및 이용 기간)</h3>
      <p className="text-gray-700 mb-4">
        회사는 수집한 정보를 이용자의 마케팅 수신 동의 기간 동안 보유 및 이용하며, 이용자가 동의를 철회하거나 회원 탈퇴를 요청하는 경우 지체 없이 해당 정보를 파기합니다. 단, 관련 법령에서 일정 기간의 보관을 요구하는 경우에는 해당 법령에 따라 보존될 수 있습니다.
      </p>

      <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제4조 (동의 철회 및 수신 거부 방법)</h3>
      <p className="text-gray-700 mb-4">
        이용자는 언제든지 마케팅 정보 수신에 대한 동의를 철회할 수 있습니다. 수신 동의 철회 시, 해당 수단을 통한 모든 마케팅 정보 발송은 즉시 중단됩니다.
      </p>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li className="mb-2">
          <strong>철회 방법:</strong>
          <ol className="list-decimal pl-6 mt-2">
            <li className="mb-1">애플리케이션 내 ‘설정 &gt; 알림 설정’ 메뉴에서 푸시 알림 수신 거부</li>
            <li className="mb-1">이메일 하단의 ‘수신거부’ 링크 클릭</li>
            <li className="mb-1">SMS 수신 시 안내된 번호로 ‘수신거부’ 회신</li>
          </ol>
        </li>
        <li className="mb-2"><strong>처리 절차:</strong> 이용자의 철회 요청 접수 즉시 관련 시스템 상의 발송 대상에서 제외되며, 관련 기기 정보는 삭제 또는 비활성화 처리됩니다.</li>
      </ul>

      <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제5조 (기타)</h3>
      <p className="text-gray-700 mb-4">
        이 약관에 명시되지 않은 사항은 회사의 [개인정보처리방침] 및 관련 법령(「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「개인정보 보호법」 등)에 따릅니다. 이용자는 본 동의를 거부할 권리가 있으며, 동의 거부 시에도 기본적인 서비스 이용은 가능하나, 개인 맞춤형 정보 제공 및 혜택 안내 등은 제한될 수 있습니다.
      </p>
    </div>
  );
};

export const PrivacyPolicyAgreement = () => {
  return (
    <div className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto p-4">
      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      <div className="bg-white rounded-lg">
        <p className="text-gray-700 mb-4 font-semibold">최종 업데이트: 2025년 8월 7일</p>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제1조 (총칙)</h2>
        <p className="text-gray-700 mb-4">
          주식회사 더퍼레이드(이하 &quot;회사&quot;)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제2조 (개인정보의 수집 및 이용 목적)</h2>
        <p className="text-gray-700 mb-4">
          ① 회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>회원가입 및 관리:</strong> 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지, 고충처리 등을 목적으로 개인정보를 처리합니다.</li>
          <li className="mb-2"><strong>서비스 제공 및 개선:</strong> AI 소설 생성 및 맞춤형 콘텐츠 제공, 서비스 유효성 확인, 접속 빈도 파악, 회원의 서비스 이용에 대한 통계 분석, 신규 기능 개발 등을 목적으로 개인정보를 처리합니다.</li>
          <li className="mb-2"><strong>마케팅 및 광고에의 활용:</strong> 이벤트 정보 및 참여 기회 제공, 광고성 정보 전달 등 마케팅 활동을 목적으로 개인정보를 처리합니다. (단, 이는 정보주체가 마케팅 정보 수신에 별도 동의한 경우에 한합니다.)</li>
          <li className="mb-2"><strong>고객 지원:</strong> 문의 및 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 등을 목적으로 개인정보를 처리합니다.</li>
        </ol>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제3조 (수집하는 개인정보의 항목 및 수집방법)</h2>
        <p className="text-gray-700 mb-4">
          ① 회사는 서비스 제공을 위해 다음의 개인정보 항목을 수집하고 있습니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>필수 항목:</strong> 이메일 주소, 암호화된 비밀번호, 닉네임, 이름, 생년월일</li>
          <li className="mb-2"><strong>선택 항목:</strong> 성별, 프로필 이미지, 소개</li>
          <li className="mb-2"><strong>서비스 이용 과정에서 자동 생성 및 수집되는 정보:</strong> 세계관 내용, AI가 생성한 소설 내용 및 AI 응답값, 결제 내역, 쿠키, 접속 IP 정보, 서비스 이용 기록, 기기 정보, Referrer 정보</li>
        </ol>
        <p className="text-gray-700 mb-4">
          ② 회사는 다음과 같은 방법으로 개인정보를 수집합니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2">회원가입, 로그인, 서비스 이용 과정에서 회원이 직접 입력</li>
          <li className="mb-2">결제, 고객센터 문의 과정에서 정보 제공</li>
          <li className="mb-2">서비스 이용 과정에서 자동으로 생성 및 수집</li>
        </ol>
        <p className="text-gray-700 mb-4">
          ③ 회사는 회원이 입력하는 채팅 내역을 저장하지 않으며, 오직 AI가 생성하여 사용자에게 제공된 소설의 내용과 AI 응답값만을 서비스 제공 및 개선 목적으로 저장합니다.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제4조 (개인정보의 처리 및 보유 기간)</h2>
        <p className="text-gray-700 mb-4">
          ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 보유·이용기간 내에서 개인정보를 처리 및 보유합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2">
            <strong>회원 가입 및 관리:</strong> 회원 탈퇴 시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지 보유합니다.
            <ul className="list-disc pl-6 mt-2">
              <li className="mb-1">가. 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
              <li className="mb-1">나. 서비스 이용에 따른 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지</li>
            </ul>
          </li>
          <li className="mb-2"><strong>전자상거래에서의 계약·청약철회, 대금결제, 재화 등의 공급기록:</strong> 5년 (근거: 「전자상거래 등에서의 소비자보호에 관한 법률」)</li>
          <li className="mb-2"><strong>서비스 이용 기록 및 통계:</strong> 서비스 품질 개선 및 통계 분석을 위해 1년간 보관 후, 개인을 식별할 수 없도록 비식별 조치하여 처리합니다.</li>
        </ol>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제5조 (개인정보의 제공 및 처리위탁)</h2>
        <p className="text-gray-700 mb-4">
          ① 회사는 정보주체의 개인정보를 제2조(개인정보의 수집 및 이용 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
        </p>
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-100">수탁업체</th>
              <th className="border border-gray-300 p-2 bg-gray-100">위탁업무 내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">네이버클라우드</td>
              <td className="border border-gray-300 p-2">서비스 운영을 위한 서버 인프라 제공 및 관리</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">다날 페이먼츠</td>
              <td className="border border-gray-300 p-2">고객 인증</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">KG 이니시스</td>
              <td className="border border-gray-300 p-2">신용카드, 휴대폰 등 결제 처리</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Openrouter.inc</td>
              <td className="border border-gray-300 p-2">대화 서비스 제공 및 서비스 개선을 위한 연구 개발</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Supabase</td>
              <td className="border border-gray-300 p-2">서비스 운영을 위한 서버 인프라 제공 및 관리</td>
            </tr>
          </tbody>
        </table>
        <p className="text-gray-700 mb-4">
          ③ 회사는 위탁계약 체결 시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리 금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ④ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보처리방침을 통하여 공개하도록 하겠습니다.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제6조 (개인정보의 파기절차 및 방법)</h2>
        <p className="text-gray-700 mb-4">
          ① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>파기절차:</strong> 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
          <li className="mb-2"><strong>파기방법:</strong> 회사는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</li>
        </ol>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제7조 (개인정보의 안전성 확보 조치)</h2>
        <p className="text-gray-700 mb-4">
          회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>관리적 조치:</strong> 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
          <li className="mb-2"><strong>기술적 조치:</strong> 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
          <li className="mb-2"><strong>물리적 조치:</strong> 전산실, 자료보관실 등의 접근통제</li>
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제8조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)</h2>
        <p className="text-gray-700 mb-4">
          ① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2">개인정보 열람요구</li>
          <li className="mb-2">오류 등이 있을 경우 정정 요구</li>
          <li className="mb-2">삭제요구</li>
          <li className="mb-2">처리정지 요구</li>
        </ol>
        <p className="text-gray-700 mb-4">
          ② 제1항에 따른 권리 행사는 회사에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ④ 만 14세 미만 아동의 법정대리인은 그 아동의 개인정보에 대한 열람, 정정·삭제, 처리정지 요구 등 제1항의 권리를 행사할 수 있습니다.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제9조 (개인정보 보호책임자)</h2>
        <p className="text-gray-700 mb-4">
          ① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>부서:</strong> 더퍼레이드 고객지원팀</li>
          <li className="mb-2"><strong>이메일:</strong> <a href="mailto:neoyourscene@gmail.com" className="text-blue-500 hover:underline">neoyourscene@gmail.com</a></li>
        </ul>
        <p className="text-gray-700 mb-4">
          ② 정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제10조 (권익침해 구제방법)</h2>
        <p className="text-gray-700 mb-4">
          정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">개인정보침해신고센터 (한국인터넷진흥원 운영) (<a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">privacy.kisa.or.kr</a> / 국번없이 118)</li>
          <li className="mb-2">개인정보 분쟁조정위원회 (<a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">www.kopico.go.kr</a> / 국번없이 1833-6972)</li>
          <li className="mb-2">대검찰청 사이버수사과 (<a href="https://www.spo.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">www.spo.go.kr</a> / 국번없이 1301)</li>
          <li className="mb-2">경찰청 사이버수사국 (<a href="https://ecrm.cyber.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ecrm.cyber.go.kr</a> / 국번없이 182)</li>
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제11조 (개인정보 처리방침의 변경)</h2>
        <p className="text-gray-700 mb-4">
          ① 이 개인정보처리방침은 시행일로부터 적용됩니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 현 개인정보처리방침 내용의 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일 전부터 서비스 내 공지사항을 통하여 고지할 것입니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">[부칙]</h3>
        <p className="text-gray-700 mb-4">
          <strong>제1조 (시행일)</strong><br/>
          이 개인정보처리방침은 2025년 8월 7일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
};
