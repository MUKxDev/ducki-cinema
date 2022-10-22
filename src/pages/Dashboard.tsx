import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { createVideoRoom } from "../database/supabase";

export default function Dashboard() {
  const { auth } = useAppContext();
  let navigate = useNavigate();
  const [url, setUrl] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: any) {
    e.preventDefault();

    setLoading(true);

    let videoRoomID = await createVideoRoom(url)
      .then((id) => id)
      .catch((error) => console.log("Dashboard => handleSubmit", error))
      .finally(() => setLoading(false));
    if (videoRoomID) {
      navigate("/rooms/" + videoRoomID);
    }
  }
  async function handleRoomSubmit(e: any) {
    e.preventDefault();
    navigate("/rooms/" + roomId);
  }

  return (
    <section
      className="w-full min-h-screen px-3 antialiased bg-indigo-600 lg:px-6 tails-selected-element"
      data-primary="indigo-600"
    >
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center w-full h-24 select-none">
          <div className="relative flex flex-wrap items-center justify-between w-full h-24 mx-auto font-medium ">
            <a href="#_" className="w-1/4 py-4 pl-6 pr-4 md:pl-4 md:py-0">
              <span className="p-1 text-xl font-black leading-none text-white select-none">
                <span className="">Ducki</span>
                <span className="text-indigo-300" data-primary="indigo-300">
                  .
                </span>
              </span>
            </a>
            <div className={"gap-2 flex"}>
              <div
                data-rounded="rounded-full"
                className="inline-flex items-center justify-center px-4 py-2 mr-1 text-base font-medium leading-6 text-indigo-600 whitespace-no-wrap transition duration-150 ease-in-out bg-white border border-transparent rounded-full cursor-pointer hover:bg-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
                data-primary="indigo-600"
                onClick={() => navigate(`/${"account"}`)}
              >
                Account
              </div>
              <a
                data-rounded="rounded-full"
                href="#_"
                className="inline-flex items-center justify-center px-4 py-2 mr-1 text-base font-medium leading-6 text-indigo-600 whitespace-no-wrap transition duration-150 ease-in-out bg-white border border-transparent rounded-full hover:bg-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
                data-primary="indigo-600"
                onClick={() => auth.signOut()}
              >
                Sign Out
              </a>
            </div>
          </div>
        </nav>
        <div className="container py-32 mx-auto text-center sm:px-4">
          <h1 className="text-4xl font-extrabold leading-10 tracking-tight text-white sm:text-5xl sm:leading-none md:text-6xl xl:text-7xl">
            <span className="block">Simplify the way you</span>{" "}
            <span className="relative inline-block mt-3 text-white">
              hang together
            </span>
          </h1>
          <div
            className="max-w-lg mx-auto mt-6 text-sm text-center text-indigo-200 md:mt-12 sm:text-base md:max-w-xl md:text-lg xl:text-xl"
            data-primary="indigo-200"
          >
            this simple website was built by Ducki to help you do activities
            with your loved ones like watching your favorite movies and TV shows
            together. (manga coming soon)
          </div>
          <form
            onSubmit={handleSubmit}
            data-rounded="rounded-full"
            className="relative flex items-center max-w-md mx-auto mt-12 overflow-hidden text-center rounded-full"
          >
            <input
              type="text"
              name="url"
              value={url}
              required
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Video URL"
              className="w-full h-12 px-6 py-2 font-medium text-indigo-800 focus:outline-none"
              data-primary="indigo-800"
            />
            <button
              type="submit"
              className={`rounded-l-none btn btn-secondary ${
                loading && "loading"
              }`}
              data-primary="indigo-600"
            >
              Watch
            </button>
          </form>
          <form
            onSubmit={handleRoomSubmit}
            data-rounded="rounded-full"
            className="relative flex items-center max-w-md mx-auto mt-12 overflow-hidden text-center rounded-full"
          >
            <input
              type="text"
              name="room"
              value={roomId}
              required
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room ID"
              className="w-full h-12 px-6 py-2 font-medium text-indigo-800 focus:outline-none"
              data-primary="indigo-800"
            />
            <button
              type="submit"
              className={`rounded-l-none btn btn-accent`}
              data-primary="indigo-600"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
