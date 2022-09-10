import { AuthError } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

import Avatar from "../components/Avatar";
import { useAppContext } from "../context/appContext";

function Account() {
  const { currentSession, supabase, auth } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [displayname, setDisplayName] = useState(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const { user } = currentSession!;

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username, displayname, avatar_url`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setDisplayName(data.displayname);
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        if (error instanceof AuthError) {
          alert(error.message);
        } else {
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [currentSession, supabase]);

  const updateProfile = async (e: any) => {
    e?.preventDefault();

    try {
      setLoading(true);
      const { user } = currentSession!;

      const updates = {
        id: user.id,
        username,
        displayname,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof AuthError) {
        alert(error.message);
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 m-4 mx-auto prose border rounded-lg bg-base-100 border-base-200"
      aria-live="polite"
    >
      {
        <form onSubmit={updateProfile} className="flex flex-col gap-3">
          <Avatar
            url={avatar_url ?? ""}
            size={150}
            onUpload={async (url) => {
              console.log("url", url);
              setAvatarUrl(url);
              //   await updateProfile(null);
            }}
          />
          <div className="">Email: {currentSession?.user.email} </div>
          <div className="flex items-center ">
            <label className="min-w-[100px]" htmlFor="username">
              UserName
            </label>
            <input
              id="username"
              type="text"
              className="input input-bordered"
              value={username || ""}
              onChange={(e: any) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label className="min-w-[100px]" htmlFor="displayname">
              DisplayName
            </label>
            <input
              id="displayname"
              type="text"
              className="input input-bordered"
              value={displayname || ""}
              onChange={(e: any) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="flex ">
            <button
              className={`btn btn-primary ${loading && "loading"}`}
              type="submit"
              disabled={loading}
            >
              Update profile
            </button>
          </div>
        </form>
      }
      <button
        type="button"
        className="mt-4 btn btn-outline"
        onClick={() => auth.signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Account;
