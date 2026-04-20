export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audio_history: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          liked: boolean | null
          played_seconds: number
          track_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          liked?: boolean | null
          played_seconds?: number
          track_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          liked?: boolean | null
          played_seconds?: number
          track_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audio_tracks: {
        Row: {
          ambient_bed: string | null
          category: string
          created_at: string
          description: string | null
          duration_seconds: number
          id: string
          is_premium: boolean
          public_url: string
          script_hash: string
          storage_path: string
          title: string
          track_key: string
          updated_at: string
          voice_id: string
          voice_name: string
        }
        Insert: {
          ambient_bed?: string | null
          category: string
          created_at?: string
          description?: string | null
          duration_seconds?: number
          id?: string
          is_premium?: boolean
          public_url: string
          script_hash: string
          storage_path: string
          title: string
          track_key: string
          updated_at?: string
          voice_id: string
          voice_name: string
        }
        Update: {
          ambient_bed?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number
          id?: string
          is_premium?: boolean
          public_url?: string
          script_hash?: string
          storage_path?: string
          title?: string
          track_key?: string
          updated_at?: string
          voice_id?: string
          voice_name?: string
        }
        Relationships: []
      }
      gratitude_entries: {
        Row: {
          ai_reflection: string | null
          category: string | null
          created_at: string
          id: string
          text: string
          updated_at: string
          user_id: string
          voice_url: string | null
        }
        Insert: {
          ai_reflection?: string | null
          category?: string | null
          created_at?: string
          id?: string
          text: string
          updated_at?: string
          user_id: string
          voice_url?: string | null
        }
        Update: {
          ai_reflection?: string | null
          category?: string | null
          created_at?: string
          id?: string
          text?: string
          updated_at?: string
          user_id?: string
          voice_url?: string | null
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          ai_insight: string | null
          created_at: string
          emotion_primary: string
          emotion_secondary: string | null
          energy: number | null
          focus: number | null
          id: string
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_insight?: string | null
          created_at?: string
          emotion_primary: string
          emotion_secondary?: string | null
          energy?: number | null
          focus?: number | null
          id?: string
          note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_insight?: string | null
          created_at?: string
          emotion_primary?: string
          emotion_secondary?: string | null
          energy?: number | null
          focus?: number | null
          id?: string
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          experience_level: string | null
          goals: Json | null
          id: string
          is_premium: boolean
          notification_preferences: Json | null
          onboarding_answers: Json | null
          preferred_voice: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          experience_level?: string | null
          goals?: Json | null
          id?: string
          is_premium?: boolean
          notification_preferences?: Json | null
          onboarding_answers?: Json | null
          preferred_voice?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          experience_level?: string | null
          goals?: Json | null
          id?: string
          is_premium?: boolean
          notification_preferences?: Json | null
          onboarding_answers?: Json | null
          preferred_voice?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ritual_completions: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          intention_word: string | null
          ritual_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          intention_word?: string | null
          ritual_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          intention_word?: string | null
          ritual_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          achievements: Json
          completed_sessions: Json
          created_at: string
          favorites: Json
          gratitude_entries: Json
          id: string
          journal_entries: Json
          last_session_date: string | null
          mood_logs: Json
          settings: Json
          streak_days: number
          total_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: Json
          completed_sessions?: Json
          created_at?: string
          favorites?: Json
          gratitude_entries?: Json
          id?: string
          journal_entries?: Json
          last_session_date?: string | null
          mood_logs?: Json
          settings?: Json
          streak_days?: number
          total_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: Json
          completed_sessions?: Json
          created_at?: string
          favorites?: Json
          gratitude_entries?: Json
          id?: string
          journal_entries?: Json
          last_session_date?: string | null
          mood_logs?: Json
          settings?: Json
          streak_days?: number
          total_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
