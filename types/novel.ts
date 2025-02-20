export interface Character {
    name: string;
    description: string;
    relationships: { character: string; relationship: string }[];
    role: 'protagonist' | 'supporting';  // 주인공/등장인물 구분
  }
  
export interface NovelCreationData {
  characters: Character[];
  plot: string;
  background: {
    description: string;
    detailedLocations: string[];
  };
  ending: 'happy' | 'sad' | 'open';
  mood: string[];
  settings: {
    hasViolence: boolean;
    hasAdultContent: boolean;
    isPublic: boolean;
  };
}

export interface Novel extends NovelCreationData {
  id: number;
  user_id: string;
  created_at: string;
  title: string;
}