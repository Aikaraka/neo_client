"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateUserPreferences(preferences: string[]) {
  const supabase = await createClient();
  
  // 현재 로그인한 사용자 정보 가져오기
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 카테고리별로 분류 (create의 MoodSelector와 동일한 구조 사용)
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

  // 선택된 취향들을 카테고리별로 분류
  const categorizedPreferences = {
    장르: [] as string[],
    설정: [] as string[],
    스토리: [] as string[],
    분위기: [] as string[],
    관계: [] as string[]
  };

  preferences.forEach(pref => {
    for (const [category, keywords] of Object.entries(keywordCategories)) {
      if (keywords.includes(pref)) {
        (categorizedPreferences as Record<string, string[]>)[category].push(pref);
        break;
      }
    }
  });

  // 사용자 취향 업데이트
  const { error: updateError } = await supabase
    .from("users")
    .update({ preferences: categorizedPreferences })
    .eq("id", user.id);

  if (updateError) {
    throw new Error("취향 설정 업데이트에 실패했습니다.");
  }

  return { success: true };
}
