import { MutableRefObject, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { supabase, useAppContext } from "../context/appContext";
// import { realtimeClient } from "../context/appContext";
import { VideoActivities } from "../database/interfaces";
// import FilePlayer from "react-player/file";

interface Props {
  videoActivitiy: VideoActivities;
}

export default function DuckiPlayer({ videoActivitiy }: Props) {
  const { currentSession } = useAppContext();
  const playerRef: MutableRefObject<ReactPlayer | null> = useRef(null);
  const [url, setUrl] = useState(videoActivitiy.url ?? "");
  const [updateUrl, setUpdateUrl] = useState(videoActivitiy.url ?? "");
  const [seek, setSeek] = useState(videoActivitiy.seek ?? 0);
  const [playing, setPlaying] = useState(videoActivitiy.isPlaying ?? false);

  useEffect(() => {
    supabase
      .channel("public:videoActivities")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "videoActivities",
          filter: `id=eq.${videoActivitiy.id}, lastUpdatedBy=neq.${currentSession?.user.id}`,
        },
        (payload: any) => {
          if (payload.new.lastUpdatedBy !== currentSession?.user.id) {
            setUrl(payload?.new?.url);
            playerRef.current?.seekTo(payload?.new?.seek);
            setSeek(payload?.new?.seek);
            setPlaying(payload?.new?.isPlaying);
            console.log("Updating from another user");
            console.log("user", payload);
          } else {
            console.log("We dont need to update anything");
            console.log("me", payload);
          }
        }
      )
      .subscribe();

    return () => {};
  }, [videoActivitiy.id, currentSession?.user.id]);

  async function getData() {
    setUrl(videoActivitiy.url!);
    playerRef.current?.seekTo(videoActivitiy.seek!);
    setPlaying(videoActivitiy.isPlaying!);
  }

  async function onSeek(seconds: number) {
    setSeek(seconds);
  }

  async function syncSeek() {
    await supabase
      .from("videoActivities")
      .update({ seek: seek, lastUpdatedBy: currentSession?.user.id })
      .eq("id", videoActivitiy.id);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    await putUrl(updateUrl);
  }

  async function putUrl(thisUrl: string) {
    await supabase
      .from("videoActivities")
      .update({
        url: thisUrl,
        isPlaying: false,
        seek: 0.0,
        lastUpdatedBy: currentSession?.user.id,
      })
      .eq("id", videoActivitiy.id);
    setUrl(thisUrl);
    setPlaying(false);
    playerRef.current?.seekTo(0.0);
  }

  async function play() {
    const { error } = await supabase
      .from("videoActivities")
      .update({
        isPlaying: true,
        seek: playerRef.current?.getCurrentTime(),
        lastUpdatedBy: currentSession?.user.id,
      })
      .eq("id", videoActivitiy.id);
    if (error) console.log(error);

    setPlaying(true);
  }
  async function pause() {
    const { error } = await supabase
      .from("videoActivities")
      .update({
        isPlaying: false,
        seek: playerRef.current?.getCurrentTime(),
        lastUpdatedBy: currentSession?.user.id,
      })
      .eq("id", videoActivitiy.id);
    if (error) console.log(error);

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
        <form className="flex w-full my-4" onSubmit={handleSubmit}>
          <input
            value={updateUrl}
            onChange={(e) => setUpdateUrl(e.target.value)}
            type="text"
            title="updateUrl"
            className="input input-bordered grow"
          />
          <button className="ml-4 btn btn-secondary" type="submit">
            update
          </button>
        </form>
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
            controls={!playing}
            playsinline
            onReady={getData}
          />
        </div>
      </div>

      <div className="flex items-center justify-center not-prose">
        <h3 className="p-2 rounded-md bg-slate-300 ">Last seek is {seek}</h3>
        <button
          disabled={playing}
          type="button"
          className={`${
            playing && "!btn-disabled"
          } px-4 py-2  m-4 font-semibold text-white rounded-lg select-none bg-slate-800 hover:cursor-pointer`}
          onClick={syncSeek}
        >
          Sync Seek
        </button>
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
