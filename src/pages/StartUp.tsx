import Auth from "../components/Auth";
import { useAppContext } from "../context/appContext";
import Dashboard from "./Dashboard";

export default function StartUp() {
  const { currentSession } = useAppContext();
  return (
    <div className="">
      {!currentSession ? <Auth /> : <Dashboard></Dashboard>}
    </div>
  );
}
