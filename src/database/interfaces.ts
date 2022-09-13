// To parse this data:
//
//   import { Convert, Room } from "./file";
//
//   const room = Convert.toRoom(json);

export interface Room {
  id?: string;
  type?: string;
  videoActivities?: VideoActivities;
}

export interface VideoActivities {
  id?: string;
  created_at?: Date;
  url?: string;
  isPlaying?: boolean;
  seek?: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toRoom(json: string): Room {
    return JSON.parse(json);
  }

  public static roomToJson(value: Room): string {
    return JSON.stringify(value);
  }
}
