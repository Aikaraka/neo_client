export type Relationship = {
  relationship: string;
  targetName: string;
};
export type Gender = "MALE" | "FEMALE" | "NONE";
export interface Character {
  name: string;
  description: string;
  relationships: Array<Relationship>;
  gender: "MALE" | "FEMALE" | "NONE";
  age: number;
  role: "protagonist" | "supporting"; // 주인공/등장인물 구분
}

export interface NovelCreationData {
  characters: Character[];
  plot: string;
  background: {
    place: string;
    time: string;
    keywords: string[];
    description: string;
    detailedLocations: string[];
  };
  ending: "happy" | "sad" | "open";
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
