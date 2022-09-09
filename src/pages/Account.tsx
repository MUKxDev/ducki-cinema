import { AuthError, Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

function Account(props: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [displayname, setDisplayName] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const { user } = props.session;

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
  }, [props.session]);

  const updateProfile = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user } = props.session;

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
      className="mx-auto p-6 bg-base-100 border border-base-200 prose rounded-lg m-4"
      aria-live="polite"
    >
      {loading ? (
        "Saving ..."
      ) : (
        <form onSubmit={updateProfile} className="flex flex-col gap-3">
          <div className="">Email: {props.session.user.email} </div>
          <div className=" flex items-center">
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
          <div className=" flex items-center">
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
          <div className=" flex">
            <button
              className="btn btn-primary"
              type="button"
              disabled={loading}
            >
              Update profile
            </button>
          </div>
        </form>
      )}
      <button
        type="button"
        className="btn btn-outline mt-4"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Account;
