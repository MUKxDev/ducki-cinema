import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { Database } from "../database/database.types";

/* Creating a new instance of the Supabase client. */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!);

interface IAppContext {
  supabase: SupabaseClient;
  auth: SupabaseAuthClient;
  currentSession: Session | null;
}
interface Props {
  children?: ReactNode;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

const AppContextProvider = ({ children }: Props) => {
  /* Setting the session state to null and then using the useEffect hook to set the session state to the
session returned from the getSession() method. */
  const [currentSession, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        supabase,
        auth: supabase.auth,
        currentSession: currentSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContext as default, AppContextProvider, useAppContext };
