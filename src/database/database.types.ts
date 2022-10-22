export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: number;
          created_at: string | null;
          profileID: string | null;
          message: string | null;
          roomID: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          profileID?: string | null;
          message?: string | null;
          roomID?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          profileID?: string | null;
          message?: string | null;
          roomID?: string | null;
        };
      };
      mangaActivities: {
        Row: {
          id: string;
          created_at: string | null;
          filePath: string | null;
          pageNumber: number | null;
        };
        Insert: {
          id: string;
          created_at?: string | null;
          filePath?: string | null;
          pageNumber?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          filePath?: string | null;
          pageNumber?: number | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          avatar_url: string | null;
          displayname: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          displayname?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          displayname?: string | null;
        };
      };
      rooms: {
        Row: {
          created_at: string | null;
          id: string;
          videoActivityID: string | null;
          mangaActivityID: string | null;
          type: Database["public"]["Enums"]["activitytype"] | null;
          emoji: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          videoActivityID?: string | null;
          mangaActivityID?: string | null;
          type?: Database["public"]["Enums"]["activitytype"] | null;
          emoji?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          videoActivityID?: string | null;
          mangaActivityID?: string | null;
          type?: Database["public"]["Enums"]["activitytype"] | null;
          emoji?: string | null;
        };
      };
      videoActivities: {
        Row: {
          id: string;
          created_at: string | null;
          url: string;
          isPlaying: boolean | null;
          seek: number | null;
          lastUpdatedBy: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          url: string;
          isPlaying?: boolean | null;
          seek?: number | null;
          lastUpdatedBy?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          url?: string;
          isPlaying?: boolean | null;
          seek?: number | null;
          lastUpdatedBy?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      activitytype: "video" | "manga";
    };
  };
}
