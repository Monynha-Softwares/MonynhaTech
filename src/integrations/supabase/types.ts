export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      authors: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          links: Json | null
          name: string
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          links?: Json | null
          name: string
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          links?: Json | null
          name?: string
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content_en: string | null
          content_pt: string | null
          created_at: string
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title_en: string | null
          title_pt: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content_en?: string | null
          content_pt?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          title_en?: string | null
          title_pt: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content_en?: string | null
          content_pt?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title_en?: string | null
          title_pt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description_en: string | null
          description_pt: string | null
          id: string
          slug: string
          title_en: string | null
          title_pt: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_pt?: string | null
          id?: string
          slug: string
          title_en?: string | null
          title_pt: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_pt?: string | null
          id?: string
          slug?: string
          title_en?: string | null
          title_pt?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          approved: boolean | null
          content: string
          created_at: string
          email: string | null
          id: string
          name: string
          post_id: string | null
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          content: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          post_id?: string | null
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          content?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          post_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      docs: {
        Row: {
          content_en: string | null
          content_pt: string | null
          created_at: string
          id: string
          parent_id: string | null
          position: number | null
          project_id: string | null
          published: boolean
          slug: string
          title_en: string | null
          title_pt: string
          updated_at: string
        }
        Insert: {
          content_en?: string | null
          content_pt?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          position?: number | null
          project_id?: string | null
          published?: boolean
          slug: string
          title_en?: string | null
          title_pt: string
          updated_at?: string
        }
        Update: {
          content_en?: string | null
          content_pt?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          position?: number | null
          project_id?: string | null
          published?: boolean
          slug?: string
          title_en?: string | null
          title_pt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "docs_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "docs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description_en: string | null
          description_pt: string | null
          icon: string | null
          id: string
          links: Json | null
          name_en: string | null
          name_pt: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_pt?: string | null
          icon?: string | null
          id?: string
          links?: Json | null
          name_en?: string | null
          name_pt: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_pt?: string | null
          icon?: string | null
          id?: string
          links?: Json | null
          name_en?: string | null
          name_pt?: string
          slug?: string
          updated_at?: string
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
