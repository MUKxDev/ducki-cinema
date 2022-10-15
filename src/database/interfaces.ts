import { Database } from "./database.types";
import { getRoomData } from "./supabase";

type RoomResponse = Awaited<ReturnType<typeof getRoomData>>;
export type RoomResponseSuccess = RoomResponse["data"] & {
  videoActivities: VideoActivities;
};

export type VideoActivities =
  Database["public"]["Tables"]["videoActivities"]["Row"];
export type Chats = Database["public"]["Tables"]["chats"]["Row"];
