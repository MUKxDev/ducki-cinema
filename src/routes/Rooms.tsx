import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Room } from "../database/interfaces";
import { getRoomData } from "../database/supabase";
import DuckiPlayer from "../pages/DuckiPlayer";

export default function Rooms() {
  let params = useParams();
  //   const { supabase } = useAppContext();
  const [roomData, setRoomData] = useState<Room | null>(null);

  useEffect(() => {
    async function setRoom() {
      if (params.id) {
        let roomData: Room | null = await getRoomData(params.id);
        setRoomData(roomData);
      }
    }
    console.log("i fire once");

    setRoom();
  }, [params.id]);

  function buildRoom(type: string | undefined) {
    switch (type) {
      case "video":
        return (
          <div>
            <h1>video type</h1>
            {roomData!.videoActivities?.url && (
              <DuckiPlayer videoActivitiy={roomData!.videoActivities} />
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
    <div className="container mx-auto prose">
      <h1>Room page</h1>

      <h4>{params.id}</h4>
      <h4>{roomData?.videoActivities?.id}</h4>
      {roomData && buildRoom(roomData!.type)}
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
