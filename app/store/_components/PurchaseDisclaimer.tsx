import React from "react"

export default function PurchaseDisclaimer() {
  const disclaimers = [
    "법정대리인의 동의 없는 미성년자의 결제는 취소될 수 있습니다.",
    "결제 금액에는 VAT가 포함되어 있습니다.",
    "결제 후 7일 내 서비스 미 이용 시 환불 가능하고, 결제 후 7일 경과 또는 서비스 이용 시에는 환불이 불가능합니다.",
    "구매한 상품은 결제일로부터 1년 이내에만 사용할 수 있습니다.",
    "주관적인 답변 생성의 불만족으로 인한 환불은 불가능합니다.",
    "그 외 모든 문의사항은 네오 고객센터로 문의주세요.",
  ]

  return (
    <div className="text-xs text-gray-400 space-y-3">
      <h3 className="font-bold text-gray-300">유의사항</h3>
      <ul className="space-y-1.5">
        {disclaimers.map((text, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-1.5 mt-1">•</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
} 