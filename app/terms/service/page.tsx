import React from 'react';

export default function ServiceTermsPage() {
  return (
    <div className="container mx-auto max-w-4xl w-full">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">이용약관</h1>
        <p className="text-gray-700 mb-4 font-semibold">최종 업데이트: 2025년 3월 1일</p>
        
        <h2 id="introduction" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">1. 소개</h2>
        <p className="text-gray-700 mb-4">
          더퍼레이드(이하 &quot;회사&quot;)에 오신 것을 환영합니다. 본 이용약관(이하 &quot;약관&quot;)은 회사가 제공하는 웹사이트, 서비스 및 애플리케이션(이하 &quot;서비스&quot;)과 관련 콘텐츠(AI가 생성한 소설 및 토큰 재화로 이용 가능한 콘텐츠)에 대한 귀하의 접근 및 이용을 규정합니다. 서비스를 이용함으로써 귀하는 본 약관에 동의하는 것으로 간주됩니다.
        </p>

        <h2 id="agreement" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">2. 약관 동의</h2>
        <p className="text-gray-700 mb-4">
          서비스에 접근하거나 이용함으로써 귀하는 본 약관에 동의하고, 본 약관을 준수하는 것으로 간주됩니다. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다. 약관 변경 시 서비스 내 공지 또는 이메일 등을 통해 사전 안내하며, 변경 후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주됩니다. 약관에 동의하지 않는 경우, 즉시 서비스 이용을 중단해야 합니다.
        </p>

        <h2 id="service-description" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">3. 서비스 설명</h2>
        <h3 className="text-lg font-semibold mt-4 mb-2">3.1 AI 소설 플랫폼</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">AI 기술을 활용한 몰입형 소설 생성 및 플레이 서비스</li>
          <li className="mb-2">사용자가 소설의 주인공으로 참여할 수 있는 인터랙티브 스토리 제공</li>
          <li className="mb-2">다양한 테마와 스토리 선택 가능</li>
        </ul>
        <h3 className="text-lg font-semibold mt-4 mb-2">3.2 토큰 제도</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">플랫폼 내 재화인 &apos;토큰&apos;을 구매하여 AI 소설 생성 및 플레이에 사용</li>
          <li className="mb-2">토큰 구매 및 사용에 대한 별도의 운영 정책 동의 필요</li>
        </ul>

        <h2 id="user-account" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">4. 사용자 계정</h2>
        <h3 className="text-lg font-semibold mt-4 mb-2">4.1 계정 생성</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">가입 시 정확하고 최신 정보를 제공해야 합니다.</li>
          <li className="mb-2">계정 정보 보호 및 기밀 유지에 대한 책임은 귀하에게 있습니다.</li>
          <li className="mb-2">계정이 무단으로 사용된 경우 즉시 회사에 알려야 합니다.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-4 mb-2">4.2 계정 책임</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">귀하는 자신의 계정에서 발생하는 모든 활동에 대한 책임을 집니다.</li>
          <li className="mb-2">귀하는 계정 정보를 제3자와 공유해서는 안 됩니다.</li>
          <li className="mb-2">회사는 본 약관을 위반한 계정을 경고 없이 정지하거나 해지할 권리를 보유합니다.</li>
        </ul>

        <h2 id="content-ownership" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">5. 콘텐츠 소유권 및 사용</h2>
        <h3 className="text-lg font-semibold mt-4 mb-2">5.1 AI 생성 콘텐츠</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">AI 모델의 특성상 생성된 콘텐츠의 결과물은 예측할 수 없으며, 입력한 프롬프트나 설정과 일치하지 않거나 품질이 떨어질 수 있습니다. 이는 환불 사유가 되지 않습니다.</li>
          <li className="mb-2">회사는 AI 콘텐츠의 진실성 및 정확성을 보증하지 않으며, 콘텐츠 검증 의무는 이용자 본인에게 있습니다.</li>
          <li className="mb-2">회사는 AI 소설 서비스 이용으로 인해 발생할 수 있는 문제에 대해 책임을 지지 않습니다. 법적 문제 소지가 있는 콘텐츠 생성 시도 및 사용은 금지됩니다.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-4 mb-2">5.2 콘텐츠 소유권</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">회사에 등록된 콘텐츠에 대한 저작재산권은 회사 및 제작자에게 귀속됩니다.</li>
          <li className="mb-2">회사는 서비스 운영, 전시, 전송, 배포, 홍보 목적으로 제작자의 별도 허락 없이 무상으로 저작권법에 규정된 공정한 관행에 합치되게 합리적인 범위 내에서 콘텐츠를 사용할 수 있습니다.</li>
          <li className="mb-2">이용자는 회사의 명시적 허가 없이 콘텐츠를 상업적 또는 기타 개인적 이익 목적으로 사용할 수 없습니다. 무단 도용으로 회사에 손해를 끼친 경우, 법적 절차에 따라 손해를 배상할 책임이 있습니다.</li>
        </ul>

        <h2 id="coin-payment" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">6. 토큰 및 결제</h2>
        <h3 className="text-lg font-semibold mt-4 mb-2">6.1 토큰 구매 및 사용</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">회사는 서비스 유지 및 품질 개선을 위해 AI 콘텐츠 이용 및 생성에 필요한 가상 재화 &apos;토큰&apos;을 판매합니다.</li>
          <li className="mb-2">토큰 결제 후 청약 철회는 불가합니다. 기술적 문제나 정당한 사유가 있는 경우, <a href="mailto:neoyourscene@gmail.com" className="text-blue-500 hover:underline">neoyourscene@gmal.com</a>으로 문의 바랍니다.</li>
          <li className="mb-2">결제 수수료는 통화 간 환율에 영향을 받을 수 있으며, 현지 상황에 따라 카드 및 은행 결제 수수료나 현전 수수료가 발생할 수 있습니다.</li>
          <li className="mb-2">유료 토큰은 결제일로부터 1년 뒤 자동 소멸되며, 사용하지 않은 토큰은 환불되지 않습니다.</li>
          <li className="mb-2">상품 구매 후 사용 내역이 없는 경우, 결제 후 7일 이내 결제 수단으로만 환불이 가능합니다.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-4 mb-2">6.2 결제 조건</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">결제는 승인된 결제 제공업체를 통해 처리됩니다.</li>
          <li className="mb-2">회사는 사전 공지 후 토큰 가격을 변경할 권리를 보유합니다.</li>
        </ul>

        <h2 id="service-restriction" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">7. 서비스 이용 제한</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">이용자는 서비스에 피해를 입힐 수 있는 행위를 해서는 안 됩니다. 피해를 입힌다고 판단될 경우, 경고 없이 계정을 차단하거나 법적 조치를 취할 수 있으며, 사용하지 않은 토큰은 환불되지 않습니다.</li>
          <li className="mb-2">회사는 다음 각 호에 해당하는 이용 신청에 대해 승낙하지 않을 수 있습니다.</li>
          <ul className="list-decimal pl-6 mt-2 mb-2">
            <li className="mb-1">토큰 구매 대금을 납부하지 않거나 잘못 납부하여 확인할 수 없는 경우</li>
            <li className="mb-1">최근 3개월 내 이용 제한 기록이 있거나 서비스 운영 정책에 따라 영구 이용 제한을 받은 경우</li>
            <li className="mb-1">법령에서 금지하는 위법 행위를 목적으로 이용 신청을 하는 경우</li>
            <li className="mb-1">만 14세 미만인 경우</li>
          </ul>
        </ul>

        <h2 id="service-change" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">8. 서비스 중단 및 변경</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">회사는 컴퓨터 등 정보통신설비의 보수 점검, 교체, 고장, 통신 두절 등의 사유로 서비스 제공을 일시적으로 중단할 수 있습니다.</li>
          <li className="mb-2">회사는 새로운 서비스로의 교체 등 적절하다고 판단하는 사유에 따라 현재 제공되는 서비스를 사전 통지 없이 완전히 변경 또는 중단할 수 있습니다.</li>
          <li className="mb-2">서비스가 완전히 중단될 경우, 3개월 이내 결제 건에 한하여 사용하지 않은 유료 토큰은 환불받을 수 있습니다.</li>
        </ul>

        <h2 id="intellectual-property" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">9. 지적 재산권</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">본 사이트에서 제공되는 모든 콘텐츠의 산업재산권은 회사에 있으며, 텍스트, 이미지 및 기타 콘텐츠뿐만 아니라 그래픽 레이아웃은 저작권법에 의해 보호됩니다.</li>
          <li className="mb-2">이용자는 회사의 사전 승낙 없이 정보를 복제, 전송, 출판, 배포, 방송 기타 방법으로 영리 목적으로 이용하거나 제3자에게 이용하게 해서는 안 됩니다.</li>
        </ul>

        <h2 id="terms-change" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">10. 약관 변경 및 효력</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">회사는 약관의 규제에 관한 법률, 전자거래기본법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
          <li className="mb-2">변경 후에도 서비스를 계속 이용하는 경우, 변경된 약관에 동의한 것으로 간주됩니다.</li>
          <li className="mb-2">회사는 중요한 변경 사항이 있을 경우 사용자에게 알릴 것입니다.</li>
        </ul>

        <h2 id="dispute-resolution" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">11. 분쟁 해결</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">회사와 이용자 간 발생한 서비스 이용에 관한 분쟁에 대하여는 대한민국 법을 적용하며, 본 분쟁으로 인한 소는 민사소송법상의 관할을 가지는 대한민국의 법원에 제기합니다.</li>
        </ul>

        <h2 id="contact-info" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">12. 연락처</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>회사명</strong>: 더퍼레이드</li>
          <li className="mb-2"><strong>문의 이메일</strong>: <a href="mailto:neoyourscene@gmail.com" className="text-blue-500 hover:underline">neoyourscene@gmail.com</a></li>
        </ul>
      </div>
    </div>
  );
}
