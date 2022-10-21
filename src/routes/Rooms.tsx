import { useEffect, useState } from "react";
import { Profiles, RoomResponseSuccess } from "../database/interfaces";
import { useParams } from "react-router-dom";
import { fetchProfiles, getRoomData } from "../database/supabase";
import DuckiPlayer from "../components/DuckiPlayer";
import Chat from "../components/Chat";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../context/appContext";

export default function Rooms() {
  let params = useParams();
  const { users } = useAppContext();
  const [roomData, setRoomData] = useState<RoomResponseSuccess | null>(null);

  const profilesQuery = useQuery<Profiles[]>(["profiles"], () =>
    fetchProfiles(users)
  );

  useEffect(() => {
    profilesQuery.refetch();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

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
    <div className="flex flex-col h-screen mx-auto lg:flex-row">
      {/* <h1>Room page</h1>

      <h4>{params.id}</h4>
      <h4>{roomData?.videoActivities?.id}</h4> */}
      {roomData && buildRoom(roomData!.type)}
      {roomData && (
        <div className="h-full p-4 px-4 pt-0 pb-4 lg:pt-4 lg:h-auto">
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
