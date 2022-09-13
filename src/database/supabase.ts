import { supabase } from "../context/appContext";
import { Convert, Room } from "./interfaces";

/**
 * It gets the room data from the database and returns it as a Room object
 * @param {string} id - string - the room id
 * @returns Room | null
 */
export async function getRoomData(id: string): Promise<Room | null> {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select(
        `
            id,
            type,
            videoActivities!inner(*)
          `
      )
      .eq("id", id);
    if (error) console.log("supabase => getRoomData", error);
    if (error) throw error;

    console.log("Room data", data);
    if (data) {
      return Convert.toRoom(JSON.stringify(data[0]));
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

/**
 * It creates a video room by inserting a video activity and then inserting a video room
 * @param {string} url - The url of the video you want to play.
 * @returns The video room ID
 */
export async function createVideoRoom(url: string): Promise<string | null> {
  let videoActivitiyID = await insertVideoActivity(url);
  let roomVideoID;
  if (videoActivitiyID) {
    roomVideoID = await insertVideoRoom(videoActivitiyID);
  }
  return roomVideoID;
}

/**
 * It creates a new room in the database with the videoActivityID and type of "video"
 * @param {string} videoActivityID - The ID of the video activity that the room is for.
 * @returns The id of the room that was created.
 */
async function insertVideoRoom(videoActivityID: string) {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .insert([{ videoActivityID: videoActivityID, type: "video" }])
      .select("id");

    if (error) console.log("createVideoRoom => error", error);
    if (error) throw error;

    console.log("createVideoRoom => data", data);
    return data ? data[0].id : null;
  } catch (error) {
    console.log("createVideoRoom => error", error);

    return null;
  }
}

/**
 * It takes a URL, inserts it into the database, and returns the ID of the newly created row
 * @param {string} url - The URL of the video
 * @returns The id of the video activity that was created.
 */
async function insertVideoActivity(url: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("videoActivities")
      .insert([{ url: url }])
      .select("id");

    if (error) console.log("createVideoActivity => error", error);
    if (error) throw error;

    console.log("createVideoActivity => data", data);
    return data ? data[0].id : null;
  } catch (error) {
    console.log("createVideoActivity => error", error);

    return null;
  }
}
