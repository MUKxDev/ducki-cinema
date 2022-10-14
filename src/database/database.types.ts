export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          profileID: string | null
          message: string | null
          roomID: string | null
          created_at: string | null
          id: number
        }
        Insert: {
          profileID?: string | null
          message?: string | null
          roomID?: string | null
          created_at?: string | null
          id?: number
        }
        Update: {
          profileID?: string | null
          message?: string | null
          roomID?: string | null
          created_at?: string | null
          id?: number
        }
      }
      mangaActivities: {
        Row: {
          id: string
          filePath: string | null
          created_at: string | null
          pageNumber: number | null
        }
        Insert: {
          id: string
          filePath?: string | null
          created_at?: string | null
          pageNumber?: number | null
        }
        Update: {
          id?: string
          filePath?: string | null
          created_at?: string | null
          pageNumber?: number | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          avatar_url: string | null
          displayname: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
          displayname?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
          displayname?: string | null
        }
      }
      rooms: {
        Row: {
          videoActivityID: string | null
          mangaActivityID: string | null
          type: Database["public"]["Enums"]["activitytype"] | null
          created_at: string | null
          id: string
        }
        Insert: {
          videoActivityID?: string | null
          mangaActivityID?: string | null
          type?: Database["public"]["Enums"]["activitytype"] | null
          created_at?: string | null
          id?: string
        }
        Update: {
          videoActivityID?: string | null
          mangaActivityID?: string | null
          type?: Database["public"]["Enums"]["activitytype"] | null
          created_at?: string | null
          id?: string
        }
      }
      videoActivities: {
        Row: {
          url: string
          lastUpdatedBy: string | null
          id: string
          created_at: string | null
          isPlaying: boolean | null
          seek: number | null
        }
        Insert: {
          url: string
          lastUpdatedBy?: string | null
          id?: string
          created_at?: string | null
          isPlaying?: boolean | null
          seek?: number | null
        }
        Update: {
          url?: string
          lastUpdatedBy?: string | null
          id?: string
          created_at?: string | null
          isPlaying?: boolean | null
          seek?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activitytype: "video" | "manga"
    }
  }
}

