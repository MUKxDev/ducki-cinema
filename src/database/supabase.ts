import { supabase } from "../context/appContext";
import { Chats, Profiles } from "./interfaces";

/**
 * Get the room data for the given room id.
 * @param {string} id - string - The id of the room we want to get data for
 */
export async function getRoomData(id: string) {
  return await supabase
    .from("rooms")
    .select(
      `
        id,
        type,
        videoActivities!inner(*)
      `
    )
    .eq("id", id)
    .single();
}

/**
 * It creates a video room by inserting a video activity and then inserting a video room
 * @param {string} url - The url of the video you want to play.
 * @returns The video room ID
 */
export async function createVideoRoom(url: string): Promise<string | null> {
  let videoActivityID = await insertVideoActivity(url);
  let roomVideoID = null;
  if (videoActivityID) {
    roomVideoID = await insertVideoRoom(videoActivityID);
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

/**
 * It inserts a new chat message into the database.
 * @param {string} message - The message that the user is sending
 * @param {string} profileID - The ID of the profile that sent the message
 * @param {string} roomID - The ID of the room you want to insert the chat into
 * @returns The id of the chat that was just inserted.
 */
export async function insertChat(
  message: string,
  profileID: string,
  roomID: string
) {
  const { data, error } = await supabase
    .from("chats")
    .insert([{ message: message, profileID: profileID, roomID: roomID }])
    .select("id")
    .single();

  if (error) console.log(error);
  if (error) throw error;

  return data;
}

export async function fetchRoomChats(roomId: string): Promise<Chats[]> {
  let temp: Chats[] = [];

  const { data } = await supabase
    .from("chats")
    .select("*")
    .eq("roomID", roomId);

  if (data) {
    return data;
  }

  return temp;
}
export async function fetchProfiles(users: string[]): Promise<Profiles[]> {
  let temp: Profiles[] = [];
  for await (const id of users) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      temp.push(data as Profiles);
    }
  }

  return temp;
}
