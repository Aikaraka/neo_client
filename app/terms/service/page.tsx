import React from 'react';

export default function ServiceTermsPage() {
  return (
    <div className="container mx-auto max-w-4xl w-full">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">이용약관</h1>

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
          <li className="mb-2">&quot;조각&quot;이라 함은 회원이 서비스 내 유료 기능을 이용하기 위해 구매하는 가상의 재화를 의미합니다.</li>
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
          <li className="mb-2">조각 구매 대금을 납부하지 않거나 잘못 납부하여 확인이 불가능한 경우</li>
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
          <li className="mb-2">조각 구매 및 사용 제도</li>
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
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제14조 (조각 및 결제)</h3>
        <p className="text-gray-700 mb-4">
          ① 회원은 서비스 내에서 조각을 구매하여 유료 기능을 이용할 수 있습니다. 조각의 가격 및 결제 조건은 서비스 내 별도 페이지에 고지합니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 결제는 회사가 지정한 결제 제공업체를 통해 처리되며, 회사는 사전 공지 후 조각 가격을 변경할 권리를 보유합니다.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 scroll-mt-20">제15조 (청약철회 및 환불)</h3>
        <p className="text-gray-700 mb-4">
          ① 회원이 구매한 조각을 전혀 사용하지 아니하였을 경우, 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 결제일로부터 7일 이내에 청약철회를 할 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ② 제10조 제1항에 따라 서비스에 대한 불만족으로 사용된 조각은 환불이 불가능합니다. 단, 시스템의 중대한 하자로 인한 환불은 neoyourscene@gmail.com으로 문의 후 회사의 내부 절차에 따라 가능할 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ③ 서비스가 회사의 귀책사유로 완전히 중단될 경우, 중단 공지일 기준 3개월 이내에 결제된 건에 한하여 사용하지 않은 유료 조각은 환불받을 수 있습니다.
        </p>
        <p className="text-gray-700 mb-4">
          ④ 유료 조각은 구매일로부터 1년간 유효하며, 유효기간이 경과한 조각은 자동 소멸되며 환불되지 않습니다.
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
}
