import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "./api/supabaseClient";
import "./App.css";
import Auth from "./components/Auth";
import Account from "./pages/Account";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="App">
      <div className="">
        {!session ? (
          <Auth />
        ) : (
          <Account key={session.user.id} session={session} />
        )}
      </div>
    </div>
  );
}

export default App;
