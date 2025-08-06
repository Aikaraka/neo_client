export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Category =
  | "로맨스"
  | "로맨스판타지"
  | "학원물"
  | "무협"
  | "이세계"
  | "게임판타지"
  | "회귀"
  | "빙의"
  | "환생"
  | "차원이동"
  | "타임슬립"
  | "서바이벌"
  | "헌터"
  | "게이트"
  | "튜토리얼"
  | "던전"
  | "현대물"
  | "시대물"
  | "궁중물"
  | "서양풍"
  | "동양풍"
  | "SF"
  | "디스토피아"
  | "가상현실"
  | "성좌물"
  | "좀비"
  | "괴수"
  | "마법"
  | "제국"
  | "기사단"
  | "황실"
  | "재벌가"
  | "연예계"
  | "아이돌"
  | "오피스"
  | "셀럽"
  | "직장물"
  | "의사물"
  | "형사물"
  | "법조물"
  | "추리"
  | "스릴러"
  | "복수극"
  | "정략결혼"
  | "로맨틱"
  | "코믹"
  | "미스터리"
  | "판타지"
  | "액션"
  | "드라마"
  | "호러"
  | "힐링"
  | "모험"
  | "일상";

export type Database = {
  public: {
    Tables: {
      novel_rankings: {
        Row: {
          calculated_at: string | null;
          chat_count: number;
          id: string;
          image_url: string | null;
          novel_id: string;
          period_label: string;
          rank: number;
          ranking_type: string;
          title: string;
        };
        Insert: {
          calculated_at?: string | null;
          chat_count: number;
          id?: string;
          image_url?: string | null;
          novel_id: string;
          period_label: string;
          rank: number;
          ranking_type: string;
          title: string;
        };
        Update: {
          calculated_at?: string | null;
          chat_count?: number;
          id?: string;
          image_url?: string | null;
          novel_id?: string;
          period_label?: string;
          rank?: number;
          ranking_type?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "novel_rankings_novel_id_fkey";
            columns: ["novel_id"];
            isOneToOne: false;
            referencedRelation: "novels";
            referencedColumns: ["id"];
          }
        ];
      };
      novel_stats: {
        Row: {
          daily_chats: number | null;
          id: string;
          last_updated_at: string | null;
          monthly_chats: number | null;
          novel_id: string;
          total_chats: number | null;
          weekly_chats: number | null;
        };
        Insert: {
          daily_chats?: number | null;
          id?: string;
          last_updated_at?: string | null;
          monthly_chats?: number | null;
          novel_id: string;
          total_chats?: number | null;
          weekly_chats?: number | null;
        };
        Update: {
          daily_chats?: number | null;
          id?: string;
          last_updated_at?: string | null;
          monthly_chats?: number | null;
          novel_id?: string;
          total_chats?: number | null;
          weekly_chats?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "novel_stats_novel_id_fkey";
            columns: ["novel_id"];
            isOneToOne: true;
            referencedRelation: "novels";
            referencedColumns: ["id"];
          }
        ];
      };
      novel_views: {
        Row: {
          created_at: string;
          id: string;
          last_viewed_at: string;
          novel_id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_viewed_at?: string;
          novel_id: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_viewed_at?: string;
          novel_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "novel_views_novel_id_fkey";
            columns: ["novel_id"];
            isOneToOne: false;
            referencedRelation: "novels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "novel_views_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      novels: {
        Row: {
          background: Json;
          characters: Json;
          created_at: string;
          ending: string;
          id: string;
          image_url: string | null;
          mood: string[];
          plot: string;
          settings: Json;
          title: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          background: Json;
          characters?: Json;
          created_at?: string;
          ending: string;
          id?: string;
          image_url?: string | null;
          mood?: string[];
          plot: string;
          settings: Json;
          title: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          background?: Json;
          characters?: Json;
          created_at?: string;
          ending?: string;
          id?: string;
          image_url?: string | null;
          mood?: string[];
          plot?: string;
          settings?: Json;
          title?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "novels_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      search_history: {
        Row: {
          created_at: string | null;
          id: string;
          search_term: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          search_term: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          search_term?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_ai_token: {
        Row: {
          created_at: string | null;
          last_purchase_date: string | null;
          last_reset_date: string | null;
          remaining_tokens: number | null;
          total_purchased: number | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          last_purchase_date?: string | null;
          last_reset_date?: string | null;
          remaining_tokens?: number | null;
          total_purchased?: number | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          last_purchase_date?: string | null;
          last_reset_date?: string | null;
          remaining_tokens?: number | null;
          total_purchased?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_ai_token_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          birthdate: string | null;
          created_at: string;
          email: string;
          gender: string | null;
          id: string;
          marketing: boolean;
          name: string | null;
          nickname: string | null;
          profile_completed: boolean | null;
          role: string;
          is_adult: boolean;
          safe_filter_enabled: boolean;
          age_verification_completed: boolean;
        };
        Insert: {
          birthdate?: string | null;
          created_at?: string;
          email: string;
          gender?: string | null;
          id: string;
          marketing?: boolean;
          name?: string | null;
          nickname?: string | null;
          profile_completed?: boolean | null;
          role: string;
          is_adult?: boolean;
          safe_filter_enabled?: boolean;
          age_verification_completed?: boolean;
        };
        Update: {
          birthdate?: string | null;
          created_at?: string;
          email?: string;
          gender?: string | null;
          id?: string;
          marketing?: boolean;
          name?: string | null;
          nickname?: string | null;
          profile_completed?: boolean | null;
          role?: string;
          is_adult?: boolean;
          safe_filter_enabled?: boolean;
          age_verification_completed?: boolean;
        };
        Relationships: [];
      };
      age_verifications: {
        Row: {
          id: string;
          user_id: string;
          verified_at: string;
          verification_method: string;
          imp_uid: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          verified_at?: string;
          verification_method: string;
          imp_uid?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          verified_at?: string;
          verification_method?: string;
          imp_uid?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "age_verifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_daily_top_novels_by_chat: {
        Args: {
          top_count?: number;
        };
        Returns: {
          novel_id: string;
          title: string;
          image_url: string;
          chat_count: number;
          rank: number;
        }[];
      };
      get_latest_novel_rankings: {
        Args: {
          ranking_type_param: string;
        };
        Returns: {
          novel_id: string;
          title: string;
          image_url: string;
          chat_count: number;
          rank: number;
          period_label: string;
          calculated_at: string;
        }[];
      };
      get_monthly_top_novels_by_chat: {
        Args: {
          top_count?: number;
        };
        Returns: {
          novel_id: string;
          title: string;
          image_url: string;
          chat_count: number;
          rank: number;
        }[];
      };
      get_novel_chat_counts: {
        Args: {
          novel_ids: string[];
        };
        Returns: {
          novel_id: string;
          chat_count: number;
        }[];
      };
      get_novel_rankings: {
        Args: {
          ranking_type_param: string;
          period_label_param: string;
        };
        Returns: {
          novel_id: string;
          title: string;
          image_url: string;
          chat_count: number;
          rank: number;
          period_label: string;
          calculated_at: string;
        }[];
      };
      get_top_novels_by_chat: {
        Args: {
          top_count?: number;
        };
        Returns: {
          novel_id: string;
          title: string;
          image_url: string;
          chat_count: number;
          rank: number;
        }[];
      };
      get_weekly_top_novels_by_chat: {
        Args: {
          top_count?: number;
        };
        Returns: {
          novel_id: string;
          title: string;
          image_url: string;
          chat_count: number;
          rank: number;
        }[];
      };
      increment_chat_stats: {
        Args: {
          novel_id_param: string;
        };
        Returns: undefined;
      };
      reset_daily_chat_stats: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      reset_monthly_chat_stats: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      reset_weekly_chat_stats: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
