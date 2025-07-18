import React from 'react';

export default function ContentPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl w-full">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">콘텐츠 규정</h1>
        <p className="text-gray-700 mb-4 font-semibold">최종 업데이트: 2025년 3월 1일</p>
        
        <h2 id="intro" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">1. 소개</h2>
        <p className="text-gray-700 mb-4">
          더퍼레이드(이하 &quot;회사&quot;)는 AI 기술을 활용한 소설 생성 및 플레이 플랫폼(이하 &quot;서비스&quot;)을 제공하며, 본 콘텐츠 규정(이하 &quot;규정&quot;)은 서비스 내에서 생성 및 사용되는 모든 콘텐츠에 적용됩니다. 본 규정은 이용자가 서비스를 통해 생성하거나 접하는 콘텐츠가 관련 법령과 사회적 기준을 준수하도록 보장하기 위한 것입니다.
        </p>
        <p className="text-gray-700 mb-4">
          회사는 대한민국의 정보통신망법 및 방송통신심의위원회의 인터넷내용등급서비스(SafeNet) 기준을 준수하며, 청소년 보호와 성인의 콘텐츠 접근 권리를 균형 있게 보장하기 위해 연령 확인 절차와 필터링 시스템을 도입하였습니다.
        </p>

        <h2 id="content-grade" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">2. 콘텐츠 등급 기준</h2>
        <p className="text-gray-700 mb-4">
          회사는 콘텐츠의 선정성, 폭력성, 언어 사용 등을 평가하여 등급을 분류하며, SafeNet 기준을 기본으로 하되 텍스트 기반 콘텐츠의 특성을 고려하여 유연하게 적용합니다. 등급에 따른 세부 기준은 아래와 같습니다.
        </p>
        <table className="w-full text-gray-700 border-collapse border border-gray-300 mb-4">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">등급</th>
              <th className="border border-gray-300 p-2">노출</th>
              <th className="border border-gray-300 p-2">성행위</th>
              <th className="border border-gray-300 p-2">폭력</th>
              <th className="border border-gray-300 p-2">언어</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">4등급 (전면 금지)</td>
              <td className="border border-gray-300 p-2">성기 노출</td>
              <td className="border border-gray-300 p-2">성범죄 또는 노골적 성행위</td>
              <td className="border border-gray-300 p-2">잔인한 살해</td>
              <td className="border border-gray-300 p-2">노골적 외설 비속어</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">3등급 (청소년 이용불가 제한적 허용)</td>
              <td className="border border-gray-300 p-2">전신 노출</td>
              <td className="border border-gray-300 p-2">노골적이지 않은 성행위</td>
              <td className="border border-gray-300 p-2">살해</td>
              <td className="border border-gray-300 p-2">심한 비속어</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">2등급 (청소년 이용불가 제한적 허용)</td>
              <td className="border border-gray-300 p-2">부분 노출</td>
              <td className="border border-gray-300 p-2">착의 상태의 성적 접촉</td>
              <td className="border border-gray-300 p-2">상해</td>
              <td className="border border-gray-300 p-2">거친 비속어</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">1등급 (전면 허용)</td>
              <td className="border border-gray-300 p-2">노출 장면</td>
              <td className="border border-gray-300 p-2">격렬한 키스</td>
              <td className="border border-gray-300 p-2">격투</td>
              <td className="border border-gray-300 p-2">일상 비속어</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">0등급 (전면 허용)</td>
              <td className="border border-gray-300 p-2">노출 없음</td>
              <td className="border border-gray-300 p-2">성행위 없음</td>
              <td className="border border-gray-300 p-2">폭력 없음</td>
              <td className="border border-gray-300 p-2">비속어 없음</td>
            </tr>
          </tbody>
        </table>

        <h2 id="content-rules" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">3. 콘텐츠 생성 규정</h2>
        <h3 className="text-lg font-semibold mt-4 mb-2">3.1 공통 규정</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>저작권 침해</strong>: 타인의 저작물을 허가 없이 사용하거나 게재해서는 안 됩니다.</li>
          <li className="mb-2"><strong>개인정보 노출</strong>: 타인의 개인정보를 동의 없이 공개하거나 배포해서는 안 됩니다.</li>
          <li className="mb-2"><strong>서비스 품질 저해</strong>: 서비스 품질을 저하시킬 우려가 있는 부적절한 텍스트나 이미지를 포함해서는 안 됩니다.</li>
          <li className="mb-2"><strong>불법 행위</strong>: 범죄 및 불법 행위에 악용될 가능성이 있는 콘텐츠, 반사회적 행위를 미화하거나 상세히 묘사하는 콘텐츠는 금지됩니다.</li>
          <li className="mb-2"><strong>스팸 및 사기</strong>: 영리 목적의 스팸, 홍보성 콘텐츠, 이용자를 기만하거나 속일 가능성이 있는 콘텐츠는 금지됩니다.</li>
          <li className="mb-2"><strong>미성년자 보호</strong>: 미성년자에게 정신적, 신체적 위해를 가할 수 있는 콘텐츠, 아동 학대나 성적 착취를 묘사하는 콘텐츠는 금지됩니다.</li>
          <li className="mb-2"><strong>사회적 금기 사항</strong>: 특정 집단이나 지역에 대한 혐오 표현, 차별적 언어, 종교, 정치, 인종, 성소수자, 국가 등을 비방하거나 혐오하는 표현은 금지됩니다.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-4 mb-2">3.2 AI 소설 텍스트 규정</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>공통 규정</strong>: 타인의 저작물 도용, 아동 또는 청소년으로 보이는 캐릭터의 성적 묘사, 과도한 저속 비속어 사용, 성기나 음모를 지칭하는 표현은 금지됩니다.</li>
          <li className="mb-2"><strong>청소년 이용 불가 콘텐츠</strong>: 선정적이거나 과도하게 폭력적인 텍스트, 청소년에게 부적절하다고 판단되는 내용은 포함해서는 안 됩니다. 성범죄나 노골적 성행위를 묘사하는 내용, 과도하게 선정적인 표현은 금지됩니다.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-4 mb-2">3.3 이미지 및 시각적 콘텐츠 규정</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>공통 규정</strong>: 타인의 이미지 도용, 초상권 침해, 아동 또는 청소년으로 보이는 캐릭터의 성적 노출, 과도한 불쾌감을 유발하는 이미지는 금지됩니다.</li>
          <li className="mb-2"><strong>청소년 이용 불가 콘텐츠</strong>: 성행위를 묘사하는 이미지, 여성 유두 노출, 성적 요소가 드러나는 이미지는 금지됩니다. 성기, 음모, 항문 노출, 투명 의상으로 비치는 경우, 성기구 포함, 과도하게 선정적인 요소는 금지됩니다.</li>
        </ul>

        <h2 id="youth-policy" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">4. 청소년 보호 정책</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>청소년 접근 제한</strong>: 회사는 청소년이 유해정보에 접근하지 않도록 연령 확인 절차를 통해 19세 이상 이용 가능 콘텐츠를 분류하고 접근을 제한합니다.</li>
          <li className="mb-2"><strong>유해정보 필터링</strong>: 서비스 내 모든 여정과 기능에서 유해 콘텐츠를 기술적으로 필터링하며, 청소년 유해정보 노출을 예방합니다.</li>
          <li className="mb-2"><strong>청소년 보호 교육</strong>: 정보통신업무 종사자를 대상으로 청소년 보호 관련 법령, 제재 기준, 대응 방법을 교육합니다.</li>
          <li className="mb-2"><strong>피해 상담 및 고충 처리</strong>: 청소년 유해정보로 인한 피해 상담 및 고충 처리를 위해 전문 인력을 배치하며, 피해 확산을 방지합니다.</li>
          <li className="mb-2"><strong>최소 연령 제한</strong>: 만 14세 미만 사용자는 보호자의 동의 하에 서비스를 제공받을 수 있습니다.</li>
        </ul>

        <h2 id="violation" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">5. 규정 위반 시 조치</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2">본 규정을 위반하는 콘텐츠는 경고 없이 삭제되거나 제한 조치가 취해질 수 있습니다.</li>
          <li className="mb-2">선정적 콘텐츠가 포함되었음에도 청소년 이용 불가로 지정하지 않은 경우, 이용자 차단 조치가 이루어질 수 있습니다.</li>
          <li className="mb-2">반복적으로 규정을 위반하거나 플랫폼에 악영향을 미치는 경우, 경고 없이 계정 차단이 이루어질 수 있습니다.</li>
        </ul>

        <h2 id="contact" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">6. 문의 및 연락처</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li className="mb-2"><strong>회사명</strong>: 더퍼레이드</li>
          <li className="mb-2"><strong>문의 이메일</strong>: <a href="mailto:limdehan@gmail.com" className="text-blue-500 hover:underline">limdehan@gmail.com</a></li>
        </ul>
        <p className="text-gray-700 mb-4">
          본 콘텐츠 규정은 2025년 3월 1일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
