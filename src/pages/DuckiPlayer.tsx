import { MutableRefObject, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { getTrackBackground, Range } from "react-range";
import { supabase, useAppContext } from "../context/appContext";
import { VideoActivities } from "../database/interfaces";
import { ReactComponent as PipOpen } from "../assets/icons/pip=open.svg";
import { ReactComponent as PipClose } from "../assets/icons/pip=close.svg";
import { ReactComponent as Play } from "../assets/icons/play-pause=play.svg";
import { ReactComponent as Pause } from "../assets/icons/play-pause=pause.svg";
import _ from "lodash";

interface Props {
  videoActivity: VideoActivities;
}

export default function DuckiPlayer({ videoActivity: videoActivitiy }: Props) {
  const { currentSession } = useAppContext();
  const playerRef: MutableRefObject<ReactPlayer | null> = useRef(null);
  const [url, setUrl] = useState(videoActivitiy.url ?? "");
  const [updateUrl, setUpdateUrl] = useState(videoActivitiy.url ?? "");
  const [seek, setSeek] = useState(videoActivitiy.seek ?? 0);
  const [duration, setDuration] = useState(999999);
  const [playing, setPlaying] = useState(videoActivitiy.isPlaying ?? false);
  const [isPip, setIsPip] = useState(false);

  useEffect(() => {});

  useEffect(() => {
    let subscription = supabase
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
          if (payload.new.lastUpdatedBy !== currentSession?.user.id) {
            setUrl(payload?.new?.url);
            playerRef.current?.seekTo(payload?.new?.seek);
            setSeek(payload?.new?.seek);
            setPlaying(payload?.new?.isPlaying);
            console.log("Updating from another user");
            console.log("user", payload);
          } else {
            // console.log("We don't need to update anything");
            // console.log("me", payload);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [videoActivitiy.id, currentSession?.user.id]);

  async function getData() {
    setUrl(videoActivitiy.url!);
    playerRef.current?.seekTo(videoActivitiy.seek!);
    setPlaying(videoActivitiy.isPlaying!);
  }

  function formateSecondsToMinutes(seconds: number): String {
    return (seconds / 60).toFixed(2).replace(".", ":");
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

  function pip() {
    let v: HTMLVideoElement | null = document.querySelector("Video");
    if (v) {
      if (Boolean(document.pictureInPictureElement)) {
        document.exitPictureInPicture();
        setIsPip(false);
      } else {
        v.requestPictureInPicture();
        setIsPip(true);
      }
    }
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
    <div className="px-4  py-4   mx-auto h-full space-y-4 prose flex flex-col !container prose-slate ">
      <div className="flex flex-col items-start justify-start">
        <div className="w-1/4 pb-4 pl-6 pr-4 md:pl-4">
          <span className="p-1 text-xl font-black leading-none select-none text-slate-600">
            <span className="">Ducki</span>
            <span className="text-indigo-300" data-primary="indigo-300">
              .
            </span>
          </span>
        </div>

        <form className="flex w-full max-w-3xl mx-auto" onSubmit={handleSubmit}>
          <input
            value={updateUrl}
            onChange={(e) => setUpdateUrl(e.target.value)}
            type="text"
            title="updateUrl"
            className="input bg-slate-100 input-bordered grow"
          />
          <button className="ml-4 btn btn-accent" type="submit">
            update
          </button>
        </form>
      </div>
      {/* Player & controls */}
      <div className="flex flex-col py-4 space-y-4 overflow-hidden grow">
        <div className="border rounded-xl w-fit h-fit !aspect-video mx-auto bg-slate-100 border-slate-300 overflow-clip">
          <div className="not-prose rounded-xl overflow-clip">
            <ReactPlayer
              playing={playing}
              ref={playerRef}
              onPlay={() => {
                isPip && play();
              }}
              onPause={() => {
                isPip && pause();
              }}
              onDisablePIP={() => {
                setIsPip(false);
              }}
              onEnablePIP={() => {
                setIsPip(true);
              }}
              width={"100%"}
              height={"100%"}
              onProgress={(state) => setSeek(state.playedSeconds)}
              url={url}
              controls={false}
              playsinline={true}
              webkit-playsinline={true}
              onReady={getData}
              onDuration={setDuration}
            />
          </div>
        </div>

        {/* Controls */}
        <div
          className={
            "p-3 rounded-xl w-full max-w-7xl mx-auto bg-slate-200 flex flex-col space-y-3"
          }
        >
          <div className="flex items-center justify-between not-prose ">
            <div className="" onClick={playing ? pause : play}>
              {playing ? (
                <Pause className="stroke-slate-300" />
              ) : (
                <Play className="stroke-slate-300" />
              )}
            </div>
            {/* desktop slider */}
            <div className={"p-3 md:block hidden grow"}>
              <Range
                min={0.0}
                max={_.ceil(duration)}
                onChange={(values) => {
                  setSeek(values[0]);
                  playerRef.current?.seekTo(values[0]);
                }}
                onFinalChange={syncSeek}
                values={[seek]}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className={"w-5  aspect-square bg-slate-400 rounded-full"}
                  />
                )}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className={`w-full h-3 rounded-full border border-slate-300`}
                    style={{
                      background: getTrackBackground({
                        values: [seek],
                        colors: ["rgb(241 245 249)", "rgb(203, 213, 225)"],
                        min: 0,
                        max: _.ceil(duration),
                      }),
                    }}
                  >
                    {children}
                  </div>
                )}
              ></Range>
            </div>

            {/* seek/duration */}
            <p className={"text-slate-700 mx-4"}>{`${formateSecondsToMinutes(
              seek
            )} / ${formateSecondsToMinutes(duration)}`}</p>

            <div className="fill-slate-600" onClick={pip}>
              {isPip ? (
                <PipClose className="stroke-slate-300" />
              ) : (
                <PipOpen className="stroke-slate-300" />
              )}
            </div>
          </div>

          {/* Mobile Slider */}
          <div className={"p-3 md:hidden"}>
            <Range
              min={0.0}
              max={_.ceil(duration)}
              onChange={(values) => {
                setSeek(values[0]);
                playerRef.current?.seekTo(values[0]);
              }}
              onFinalChange={syncSeek}
              values={[seek]}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  className={"w-5  aspect-square bg-slate-400 rounded-full"}
                />
              )}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className={`w-full h-3 rounded-full border border-slate-300`}
                  style={{
                    background: getTrackBackground({
                      values: [seek],
                      colors: ["rgb(241 245 249)", "rgb(203, 213, 225)"],
                      min: 0,
                      max: _.ceil(duration),
                    }),
                  }}
                >
                  {children}
                </div>
              )}
            ></Range>
          </div>
        </div>
      </div>
    </div>
  );
}
