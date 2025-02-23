export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      novel_views: {
        Row: {
          created_at: string;
          id: string;
          last_viewed_at: string;
          novel_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_viewed_at?: string;
          novel_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_viewed_at?: string;
          novel_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "novel_views_novel_id_fkey";
            columns: ["novel_id"];
            isOneToOne: false;
            referencedRelation: "novels";
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
          user_id: string;
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
          user_id: string;
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
          user_id?: string;
        };
        Relationships: [];
      };
      token_purchase_history: {
        Row: {
          amount: number;
          id: string;
          payment_method: string | null;
          payment_status: string | null;
          price: number;
          purchase_date: string | null;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          id?: string;
          payment_method?: string | null;
          payment_status?: string | null;
          price: number;
          purchase_date?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          id?: string;
          payment_method?: string | null;
          payment_status?: string | null;
          price?: number;
          purchase_date?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_ai_token: {
        Row: {
          last_purchase_date: string | null;
          last_reset_date: string | null;
          remaining_tokens: number | null;
          total_purchased: number | null;
          user_id: string;
        };
        Insert: {
          last_purchase_date?: string | null;
          last_reset_date?: string | null;
          remaining_tokens?: number | null;
          total_purchased?: number | null;
          user_id: string;
        };
        Update: {
          last_purchase_date?: string | null;
          last_reset_date?: string | null;
          remaining_tokens?: number | null;
          total_purchased?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          auth_provider: string | null;
          birthdate: string | null;
          created_at: string;
          email: string;
          gender: string | null;
          id: string;
          name: string | null;
          nickname: string | null;
          profile_completed: boolean | null;
        };
        Insert: {
          auth_provider?: string | null;
          birthdate?: string | null;
          created_at?: string;
          email: string;
          gender?: string | null;
          id: string;
          name?: string | null;
          nickname?: string | null;
          profile_completed?: boolean | null;
        };
        Update: {
          auth_provider?: string | null;
          birthdate?: string | null;
          created_at?: string;
          email?: string;
          gender?: string | null;
          id?: string;
          name?: string | null;
          nickname?: string | null;
          profile_completed?: boolean | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
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
