import { useEffect, useState } from "react";
import { RoomResponseSuccess } from "../database/interfaces";
import { useParams } from "react-router-dom";
import { getRoomData } from "../database/supabase";
import DuckiPlayer from "../pages/DuckiPlayer";
import Chat from "../components/Chat";

export default function Rooms() {
  let params = useParams();
  const [roomData, setRoomData] = useState<RoomResponseSuccess | null>(null);

  useEffect(() => {
    async function setRoom() {
      if (params.id) {
        let roomData: RoomResponseSuccess | null = await getRoomData(
          params.id
        ).then((response) =>
          response.status === 200
            ? (response.data as RoomResponseSuccess)
            : null
        );

        setRoomData(roomData);
      }
    }

    setRoom();
  }, [params.id]);

  function buildRoom(type: string | null) {
    switch (type) {
      case "video":
        return (
          <div className="w-full">
            {/* <h1>video type</h1> */}
            {roomData!.videoActivities?.url && (
              <DuckiPlayer videoActivity={roomData!.videoActivities} />
            )}
          </div>
        );
      case "manga":
        return (
          <div>
            <h1>manga type</h1>
          </div>
        );

      default:
        return (
          <div>
            <h1>not found</h1>
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col h-screen mx-auto  lg:flex-row">
      {/* <h1>Room page</h1>

      <h4>{params.id}</h4>
      <h4>{roomData?.videoActivities?.id}</h4> */}
      {roomData && buildRoom(roomData!.type)}
      {roomData && (
        <div className="p-4">
          {" "}
          <Chat roomID={roomData.id}></Chat>
        </div>
      )}
    </div>
  );
}

// (roomData!.type === "video" ? (
//     <div></div>
//   ) : roomData!.type === "manga" ? (
//     <div></div>
//   ) : (
//     <div></div>
//   ))
