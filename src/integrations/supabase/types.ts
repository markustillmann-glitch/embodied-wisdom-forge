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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coach_insights: {
        Row: {
          confidence_level: string | null
          created_at: string
          id: string
          insight_content: string
          insight_hash: string
          insight_type: string
          last_observed_at: string | null
          observation_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_level?: string | null
          created_at?: string
          id?: string
          insight_content: string
          insight_hash: string
          insight_type: string
          last_observed_at?: string | null
          observation_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_level?: string | null
          created_at?: string
          id?: string
          insight_content?: string
          insight_hash?: string
          insight_type?: string
          last_observed_at?: string | null
          observation_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      memories: {
        Row: {
          additional_thoughts: string | null
          content: string
          conversation_id: string | null
          created_at: string
          emotion: string | null
          feeling_after: string[] | null
          id: string
          image_url: string | null
          memory_book_data: Json | null
          memory_date: string | null
          memory_type: string
          needs_after: string[] | null
          pdf_url: string | null
          summary: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_thoughts?: string | null
          content: string
          conversation_id?: string | null
          created_at?: string
          emotion?: string | null
          feeling_after?: string[] | null
          id?: string
          image_url?: string | null
          memory_book_data?: Json | null
          memory_date?: string | null
          memory_type?: string
          needs_after?: string[] | null
          pdf_url?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_thoughts?: string | null
          content?: string
          conversation_id?: string | null
          created_at?: string
          emotion?: string | null
          feeling_after?: string[] | null
          id?: string
          image_url?: string | null
          memory_book_data?: Json | null
          memory_date?: string | null
          memory_type?: string
          needs_after?: string[] | null
          pdf_url?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seminar_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          interest: string
          message: string | null
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interest: string
          message?: string | null
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interest?: string
          message?: string | null
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      token_usage: {
        Row: {
          created_at: string
          estimated_cost_usd: number | null
          function_name: string
          id: string
          input_tokens: number
          model: string | null
          output_tokens: number
          total_tokens: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          estimated_cost_usd?: number | null
          function_name: string
          id?: string
          input_tokens?: number
          model?: string | null
          output_tokens?: number
          total_tokens?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          estimated_cost_usd?: number | null
          function_name?: string
          id?: string
          input_tokens?: number
          model?: string | null
          output_tokens?: number
          total_tokens?: number
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          belonging_through: string[] | null
          biggest_challenges: string | null
          coach_tonality: string | null
          core_needs: string[] | null
          created_at: string
          current_focus: string[] | null
          energy_level: string | null
          goals_motivation: string | null
          harder_closeness_or_boundaries: string | null
          id: string
          interpretation_style: string | null
          language_triggers: string[] | null
          life_phase: string | null
          lightness_depth_balance: string | null
          memory_effect: string | null
          neglected_needs: string[] | null
          nervous_system_tempo: string | null
          over_fulfilled_needs: string[] | null
          overwhelm_signals: string | null
          photo_url: string | null
          praise_level: string | null
          preferred_tone: string[] | null
          primary_memory_channel: string[] | null
          reaction_to_expectations: string | null
          response_preference: string[] | null
          safety_feeling: string | null
          trigger_sensitivity: string | null
          updated_at: string
          user_id: string
          vault_password_hash: string | null
          when_depth_burdening: string | null
          when_depth_nourishing: string | null
          when_feels_light: string | null
        }
        Insert: {
          belonging_through?: string[] | null
          biggest_challenges?: string | null
          coach_tonality?: string | null
          core_needs?: string[] | null
          created_at?: string
          current_focus?: string[] | null
          energy_level?: string | null
          goals_motivation?: string | null
          harder_closeness_or_boundaries?: string | null
          id?: string
          interpretation_style?: string | null
          language_triggers?: string[] | null
          life_phase?: string | null
          lightness_depth_balance?: string | null
          memory_effect?: string | null
          neglected_needs?: string[] | null
          nervous_system_tempo?: string | null
          over_fulfilled_needs?: string[] | null
          overwhelm_signals?: string | null
          photo_url?: string | null
          praise_level?: string | null
          preferred_tone?: string[] | null
          primary_memory_channel?: string[] | null
          reaction_to_expectations?: string | null
          response_preference?: string[] | null
          safety_feeling?: string | null
          trigger_sensitivity?: string | null
          updated_at?: string
          user_id: string
          vault_password_hash?: string | null
          when_depth_burdening?: string | null
          when_depth_nourishing?: string | null
          when_feels_light?: string | null
        }
        Update: {
          belonging_through?: string[] | null
          biggest_challenges?: string | null
          coach_tonality?: string | null
          core_needs?: string[] | null
          created_at?: string
          current_focus?: string[] | null
          energy_level?: string | null
          goals_motivation?: string | null
          harder_closeness_or_boundaries?: string | null
          id?: string
          interpretation_style?: string | null
          language_triggers?: string[] | null
          life_phase?: string | null
          lightness_depth_balance?: string | null
          memory_effect?: string | null
          neglected_needs?: string[] | null
          nervous_system_tempo?: string | null
          over_fulfilled_needs?: string[] | null
          overwhelm_signals?: string | null
          photo_url?: string | null
          praise_level?: string | null
          preferred_tone?: string[] | null
          primary_memory_channel?: string[] | null
          reaction_to_expectations?: string | null
          response_preference?: string[] | null
          safety_feeling?: string | null
          trigger_sensitivity?: string | null
          updated_at?: string
          user_id?: string
          vault_password_hash?: string | null
          when_depth_burdening?: string | null
          when_depth_nourishing?: string | null
          when_feels_light?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      analytics_conversation_stats: {
        Row: {
          conversation_count: number | null
          date: string | null
        }
        Relationships: []
      }
      analytics_insight_patterns: {
        Row: {
          confidence_level: string | null
          count: number | null
          insight_type: string | null
        }
        Relationships: []
      }
      analytics_memory_stats: {
        Row: {
          count: number | null
          date: string | null
          emotion: string | null
          memory_type: string | null
        }
        Relationships: []
      }
      analytics_message_stats: {
        Row: {
          avg_message_length: number | null
          date: string | null
          message_count: number | null
          role: string | null
        }
        Relationships: []
      }
      analytics_token_stats: {
        Row: {
          call_count: number | null
          date: string | null
          function_name: string | null
          model: string | null
          total_cost: number | null
          total_input_tokens: number | null
          total_output_tokens: number | null
          total_tokens: number | null
        }
        Relationships: []
      }
      analytics_user_segments: {
        Row: {
          segment: string | null
          user_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hash_sensitive_data: { Args: { input_text: string }; Returns: string }
      log_data_access: {
        Args: {
          p_action: string
          p_record_id?: string
          p_table_name: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
