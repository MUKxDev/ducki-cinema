import { MutableRefObject, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { supabase } from "../context/appContext";
// import { realtimeClient } from "../context/appContext";
import { VideoActivities } from "../database/interfaces";
// import FilePlayer from "react-player/file";

interface Props {
  videoActivitiy: VideoActivities;
}

export default function DuckiPlayer({ videoActivitiy }: Props) {
  const playerRef: MutableRefObject<ReactPlayer | null> = useRef(null);
  const [url, setUrl] = useState("");
  const [seek, setSeek] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    supabase
      .channel("public:videoActivities")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "videoActivities",
          filter: `id=eq.${videoActivitiy.id}`,
        },
        (payload: any) => {
          setUrl(payload?.new?.url);
          setSeek(payload?.new?.seek);
          setPlaying(payload?.new?.isPlaying);
        }
      )
      .subscribe();

    return () => {};
  }, [videoActivitiy.id]);

  useEffect(() => {
    if (videoActivitiy.url) {
      setUrl(videoActivitiy.url!);
    }

    return () => {};
  }, [videoActivitiy]);

  useEffect(() => {
    let currentTime = playerRef.current?.getCurrentTime() ?? 0;
    setSeek(currentTime);
  }, []);

  function seek50() {
    console.log("SEEK 50 Clicked");
    playerRef.current?.seekTo(0.5);
  }

  function onSeek(seconds: number) {
    console.log("onSeek => seconds", seconds);
    setSeek(seconds);
  }

  function play() {
    setPlaying(true);
  }
  function pause() {
    setPlaying(false);
  }

  return (
    <div className="container p-6 mx-auto prose prose-slate">
      <div className="flex flex-col items-start justify-start">
        <h1>DuckiPlayer</h1>
        {/* <iframe
          src="https://vidstream.pro/e/X1P2Z7KKOJ62?sub.info=https%3A%2F%2Ffmovies.to%2Fajax%2Fepisode%2Fsubtitles%2Fafcb80dfbeb8a2c78a514f34ccefbe05%3F"
          title="s"
        ></iframe> */}
        <p>
          This player is made to help you watch movies with your loved ones.
        </p>
      </div>
      <div className="w-full p-3 border rounded-2xl bg-slate-100 border-slate-300">
        <div className="w-full not-prose rounded-xl overflow-clip">
          <ReactPlayer
            playing={playing}
            ref={playerRef}
            width={"100%"}
            height={"100%"}
            onSeek={onSeek}
            onPlay={play}
            onPause={pause}
            url={url}
            controls
            playsinline
          />
        </div>
      </div>

      <div className="flex items-center justify-center not-prose">
        <h3 className="p-2 rounded-md bg-slate-300 ">currnet seek is {seek}</h3>
        <div
          className="px-4 py-2 m-4 font-semibold text-white rounded-lg select-none bg-slate-800 hover:cursor-pointer"
          onClick={seek50}
        >
          Seek to 50
        </div>
        <div
          className="px-4 py-2 m-4 font-semibold text-white rounded-lg select-none bg-slate-800 hover:cursor-pointer"
          onClick={playing ? pause : play}
        >
          {playing ? "pause" : "play"}
        </div>
      </div>
    </div>
  );
}
