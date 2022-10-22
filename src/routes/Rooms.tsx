import { useEffect, useState } from "react";
import { Profiles, RoomResponseSuccess } from "../database/interfaces";
import { useParams } from "react-router-dom";
import { fetchProfiles, getRoomData } from "../database/supabase";
import { Rooms as IRooms } from "../database/interfaces";
import DuckiPlayer from "../components/DuckiPlayer";
import Chat from "../components/Chat";
import { useQuery } from "@tanstack/react-query";
import { supabase, useAppContext } from "../context/appContext";
import FallingEmojis from "../components/DuckiEmojis";
import { delay } from "lodash";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function Rooms() {
  let params = useParams();
  const { users } = useAppContext();
  const [roomData, setRoomData] = useState<RoomResponseSuccess | null>(null);

  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [showEmojis, setShowEmojis] = useState<boolean>(false);

  const profilesQuery = useQuery<Profiles[]>(["profiles"], () =>
    fetchProfiles(users)
  );

  useEffect(() => {
    let subscription: RealtimeChannel;
    if (roomData?.id) {
      console.log("roomData?.id is ", roomData?.id);
      subscription = supabase
        .channel("public:rooms")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "rooms",
            filter: `id=eq.${roomData?.id}`,
          },
          (payload) => {
            console.log(payload);
            if ((payload.new as IRooms).emoji) {
              setEmoji((payload.new as IRooms).emoji!);
              console.log("payload", payload.new);
            }
          }
        )
        .subscribe();
    }

    function setEmoji(emoji: string) {
      setSelectedEmoji(emoji);

      setShowEmojis(true);
      delay(() => {
        setShowEmojis(false);
      }, 3000);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [roomData?.id]);

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
    <div>
      <div className="absolute top-0 bottom-0 left-0 right-0 select-none ">
        <FallingEmojis
          repeat={-1}
          speed={3}
          emojis={[selectedEmoji]}
          disable={!showEmojis}
          shake
          density={20}
        ></FallingEmojis>
      </div>
      <div className="flex flex-col h-screen mx-auto lg:flex-row">
        {/* Reactions */}

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
