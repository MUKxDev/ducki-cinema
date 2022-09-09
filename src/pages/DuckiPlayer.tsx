import { MutableRefObject, useEffect, useRef, useState } from "react";
import FilePlayer from "react-player/file";

export default function DuckiPlayer() {
  const playerRef: MutableRefObject<FilePlayer | null> = useRef(null);
  const [seek, setSeek] = useState(0);
  const [playing, setPlaying] = useState(false);

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
    <div className="prose prose-slate container mx-auto p-6">
      <div className="flex flex-col justify-start items-start">
        <h1>DuckiPlayer</h1>
        <p>
          This player is made to help you watch movies with your loved ones.
        </p>
      </div>
      <div className="w-full p-3 rounded-2xl bg-slate-100 border border-slate-300">
        <div className="w-full not-prose rounded-xl overflow-clip">
          <FilePlayer
            playing={playing}
            ref={playerRef}
            width={"100%"}
            height={"100%"}
            onSeek={onSeek}
            onPlay={play}
            onPause={pause}
            url={
              "https://zloj.vizcloud.ink/simple/EqPFIfsQWADtjDlGha7rC8Eu+Vxa5uTpSkB7rqk+wYMnU94US2El/br/list.m3u8"
            }
            controls
          />
        </div>
      </div>

      <div className="flex justify-center items-center not-prose">
        <h3 className="p-2 bg-slate-300 rounded-md ">currnet seek is {seek}</h3>
        <div
          className="px-4 m-4 select-none py-2 bg-slate-800 text-white font-semibold hover:cursor-pointer rounded-lg"
          onClick={seek50}
        >
          Seek to 50
        </div>
        <div
          className="px-4 m-4 select-none py-2 bg-slate-800 text-white font-semibold hover:cursor-pointer rounded-lg"
          onClick={playing ? pause : play}
        >
          {playing ? "pause" : "play"}
        </div>
      </div>
    </div>
  );
}
