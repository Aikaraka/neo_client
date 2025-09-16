"use client";

import { useState } from "react";
import { X } from "lucide-react";

// create 페이지의 MoodSelector에서 가져온 장르 목록
const keywordCategories = {
  "장르": [
    "로맨스", "로맨스판타지", "무협", "이세계", "게임판타지", 
    "SF", "디스토피아", "가상현실", "성좌물", "좀비", "괴수",
    "추리물", "미스터리", "호러", "느와르", "로맨틱코미디", "일상물", 
    "힐링물", "코믹", "가족드라마"
  ],
  "설정": [
    "학원물", "현대물", "시대물", "궁중물", "서양풍", "동양풍",
    "재벌가", "연예계", "아이돌", "오피스", "셀럽", "직장물",
    "의사물", "형사물", "법조물", "스포츠물", "육아물", "군대물", 
    "전쟁물", "정치물", "캠퍼스물", "기숙사물", "식당물"
  ],
  "스토리": [
    "회귀", "빙의", "환생", "차원이동", "타임슬립", "서바이벌",
    "헌터", "게이트", "튜토리얼", "던전", "복수극", "정략결혼",
    "착각계", "악역물", "하렘", "역하렘", "재회물", "성장물", 
    "먼치킨", "치트능력", "계약연애", "첫사랑", "삼각관계", "권선징악", 
    "역전극", "영웅서사", "다크히어로", "배틀로얄", "비밀정체", "음모론", 
    "주종관계", "혐오관계", "악연재회", "구원서사"
  ],
  "분위기": [
    "달달", "심쿵", "설렘", "애틋", "감동", "웃김", "코믹", "유쾌",
    "따뜻", "힐링", "잔잔", "몽환", "신비", "로맨틱", "서정적", 
    "감성적", "밝음", "희망적", "긍정적", "평화", "안정", "위로"
  ],
  "관계": [
    "집착공", "순애공", "츤데레", "얀데레", "쿨남", "따뜻남", "다정남",
    "절륜남", "피폐남", "순정남", "북부대공", "신분차이", "상하관계",
    "라이벌", "소꿉친구", "원수지간", "멘토멘티", "보호자관계"
  ]
};

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPreferences: string[];
  onSave: (preferences: string[]) => void;
  isLoading?: boolean;
}

export default function PreferencesModal({ 
  isOpen, 
  onClose, 
  selectedPreferences, 
  onSave,
  isLoading = false
}: PreferencesModalProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedPreferences);

  if (!isOpen) return null;

  const togglePreference = (preference: string) => {
    if (tempSelected.includes(preference)) {
      setTempSelected(tempSelected.filter(p => p !== preference));
    } else if (tempSelected.length < 12) { // 최대 12개 제한
      setTempSelected([...tempSelected, preference]);
    }
  };

  const handleSave = () => {
    onSave(tempSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full m-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">내 취향 설정</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(keywordCategories).map(([category, keywords]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => togglePreference(keyword)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      tempSelected.includes(keyword)
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${
                      !tempSelected.includes(keyword) && tempSelected.length >= 12
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!tempSelected.includes(keyword) && tempSelected.length >= 12}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <span className="text-sm text-gray-600">
            선택된 취향: {tempSelected.length}/12
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
