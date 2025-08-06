import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl w-full">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">개인정보처리방침</h1>
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
}

