import { useState } from "react";
import { useAppContext } from "../context/appContext";

export default function Dashboard() {
  const { auth, supabase } = useAppContext();
  const [url, setUrl] = useState<string>("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    console.log("Handling submit");
    let videoActivityID = await createVideoActivity();
    let videoRoomID;
    if (videoActivityID) {
      videoRoomID = await createVideoRoom(videoActivityID);
    }
    if (videoRoomID) {
      //TODO ROUTE TO ROOM PAGE with room data
      // ? this query get the data required for video player depending on the room id
      // const { data, error } = await supabase
      //   .from("rooms")
      //   .select(
      //     `
      //     id,
      //     type,
      //     videoActivities!inner(*)
      //   `
      //   )
      //   .eq("id", videoRoomID);
    }
  }

  async function createVideoRoom(videoActivityID: string) {
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

  async function createVideoActivity(): Promise<string | null> {
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

  return (
    <section
      className="w-full px-3 antialiased bg-indigo-600 min-h-screen lg:px-6 tails-selected-element"
      data-primary="indigo-600"
      data-tails-scripts="//unpkg.com/alpinejs"
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
            this simple website built by Ducki helps you do activities with your
            loved ones like watching your favorite movies and TV
            shows.&nbsp;(manga coming soon)
          </div>
          <form
            onSubmit={handleSubmit}
            data-rounded="rounded-full"
            className="relative flex items-center max-w-md mx-auto mt-12 overflow-hidden text-center rounded-full"
          >
            <input
              type="text"
              name="email"
              value={url}
              required
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Video URL"
              className="w-full h-12 px-6 py-2 font-medium text-indigo-800 focus:outline-none"
              data-primary="indigo-800"
            />
            <span className="relative top-0 right-0 block">
              <button
                type="submit"
                className="inline-flex items-center w-32 h-12 px-8 text-base font-bold leading-6 text-white transition duration-150 ease-in-out bg-indigo-400 border border-transparent hover:bg-indigo-700 focus:outline-none active:bg-indigo-700"
                data-primary="indigo-600"
              >
                Watch
              </button>
            </span>
          </form>
        </div>
      </div>
    </section>
  );
}
