import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl w-full">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">개인정보처리방침</h1>
        <p className="text-gray-700 mb-4 font-semibold">최종 업데이트: 2025년 3월 1일</p>
        
        <h2 id="general-rules" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">1. 총칙</h2>
        <p className="text-gray-700 mb-4">
          더퍼레이드(이하 &quot;회사&quot;)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </p>
        <p className="text-gray-700 mb-4">
          회사는 AI가 생성한 소설을 사용자에게 제공하고, 사용자가 소설의 주인공으로 플레이할 수 있는 플랫폼 서비스(이하 &quot;서비스&quot;)를 운영하며, 사용자의 개인정보 보호를 최우선으로 삼아 관련 법률 및 지침을 준수합니다.
        </p>

        <h2 id="collection-purpose" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">2. 개인정보의 수집 및 이용 목적</h2>
        <p className="text-gray-700 mb-4">
          회사는 다음의 목적을 위해 최소한의 개인정보를 수집 및 이용합니다. 수집된 개인정보는 다음 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경될 경우 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 절차를 이행합니다.
        </p>
        <ul className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>회원가입 및 관리</strong>: 회원제 서비스 제공, 본인 확인, 개인 식별, 중복 가입 방지, 부정 이용 방지, 서비스 이용 의사 확인</li>
          <li className="mb-2"><strong>서비스 제공 및 개선</strong>: AI 소설 생성 및 사용자 맞춤형 콘텐츠 제공, 서비스 유효성 확인, 접속 빈도 파악, 사용 통계 분석, 신규 기능 개발</li>
          <li className="mb-2"><strong>마케팅 및 광고</strong>: 이벤트 정보 제공, 광고성 정보 전달, 참여 기회 제공 (사용자 동의 시에 한함)</li>
          <li className="mb-2"><strong>고객 지원</strong>: 문의 및 민원 처리, 고지사항 전달</li>
        </ul>

        <h2 id="collection-items" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">3. 수집하는 개인정보 항목</h2>
        <p className="text-gray-700 mb-4">
          회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>필수 항목</strong>: 이메일, 암호화된 비밀번호, 닉네임</li>
          <li className="mb-2"><strong>선택 항목</strong>: 이름, 생년월일, 성별, 프로필 이미지, 소개</li>
          <li className="mb-2"><strong>서비스 이용 기록</strong>: 세계관 내용, 저장을 위한 AI 응답값 내역, 결제 내역, 쿠키, Referrer 정보</li>
        </ul>
        <p className="text-gray-700 mb-4">
          개인정보 수집 방법: 회원가입, 로그인, 서비스 이용 중 대화 및 소설 플레이, 결제, 고객 문의
        </p>

        <h2 id="retention-period" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">4. 개인정보의 보유 및 이용 기간</h2>
        <p className="text-gray-700 mb-4">
          회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에 따라 일정 기간 보관 의무가 있는 경우에는 해당 기간 동안 보관 후 파기합니다.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">회원 탈퇴 시: 즉시 파기 (단, 거래 관련 정보는 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 5년 보관)</li>
          <li className="mb-2">서비스 이용 기록 및 통계: 1년 보관 후 익명화 처리</li>
        </ul>

        <h2 id="provision-consignment" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">5. 개인정보의 제공 및 위탁</h2>
        <p className="text-gray-700 mb-4">
          회사는 원칙적으로 사용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">사용자가 사전에 동의한 경우</li>
          <li className="mb-2">법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
        </ul>
        <p className="text-gray-700 mb-4">
          또한, 서비스 제공을 위해 필요한 경우 개인정보 처리를 위탁할 수 있으며, 위탁 시 관련 법령에 따라 위탁받는 자와의 계약을 통해 개인정보 보호를 보장합니다.
        </p>

        <h2 id="protection-measures" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">6. 개인정보 보호를 위한 조치</h2>
        <p className="text-gray-700 mb-4">
          회사는 사용자의 개인정보를 안전하게 보호하기 위해 다음과 같은 보안 조치를 취하고 있습니다.
        </p>
        <ul className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>개인정보 암호화</strong>: 비밀번호 등 중요한 정보는 암호화되어 저장 및 전송됩니다.</li>
          <li className="mb-2"><strong>접근 통제</strong>: 개인정보에 접근할 수 있는 인원을 최소화하고, 접근 권한을 엄격히 관리합니다.</li>
          <li className="mb-2"><strong>접속 기록 관리</strong>: 개인정보 처리 시스템 접속 기록을 1년 이상 보관하며, 위변조 방지 조치를 취합니다.</li>
        </ul>

        <h2 id="rights-duties" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">7. 정보 주체의 권리, 의무 및 행사 방법</h2>
        <p className="text-gray-700 mb-4">
          사용자는 언제든지 회사에 대해 다음과 같은 개인정보 보호 관련 권리를 행사할 수 있습니다.
        </p>
        <ul className="list-decimal pl-6 text-gray-700 mb-4">
          <li className="mb-2">개인정보 열람 요구</li>
          <li className="mb-2">개인정보 정정 요구 (오류가 있는 경우)</li>
          <li className="mb-2">개인정보 삭제 요구</li>
          <li className="mb-2">처리 정지 요구</li>
        </ul>
        <p className="text-gray-700 mb-4">
          위 권리 행사는 서면, 전자우편, 모사전송(FAX) 등을 통해 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.
        </p>

        <h2 id="manager-contact" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">8. 개인정보 관리 책임자 및 문의</h2>
        <p className="text-gray-700 mb-4">
          회사는 사용자의 개인정보를 보호하고 관련 불만을 처리하기 위해 아래와 같이 개인정보 관리 책임자를 지정하고 있습니다.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>개인정보 관리 책임자</strong>: 더퍼레이드 고객지원팀</li>
          <li className="mb-2"><strong>문의 이메일</strong>: <a href="mailto:neoyourscene@gmail.com" className="text-blue-500 hover:underline">neoyourscene@gmail.com</a></li>
        </ul>
        <p className="text-gray-700 mb-4">
          기타 개인정보 침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">한국인터넷진흥원 개인정보침해신고센터 (<a href="https://privacy.kisa.or.kr" className="text-blue-500 hover:underline">privacy.kisa.or.kr</a> / 국번없이 118)</li>
          <li className="mb-2">경찰청 사이버수사국 (<a href="https://ecrm.cyber.go.kr" className="text-blue-500 hover:underline">ecrm.cyber.go.kr</a> / 국번없이 182)</li>
        </ul>

        <h2 id="policy-changes" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">9. 개인정보처리방침의 변경</h2>
        <p className="text-gray-700 mb-4">
          본 개인정보처리방침은 수시로 변경될 수 있으며, 변경 시 문서 상단의 최종 업데이트 일자를 변경 일자로 갱신합니다. 변경 사항은 즉시 적용되며, 이전 방침을 대체합니다.
        </p>
      </div>
    </div>
  );
}

