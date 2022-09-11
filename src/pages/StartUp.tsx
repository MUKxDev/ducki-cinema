import Auth from "../components/Auth";
import { useAppContext } from "../context/appContext";
// import Account from "./Account";
import DuckiPlayer from "./DuckiPlayer";

export default function StartUp() {
  const { currentSession } = useAppContext();
  return (
    <div className="">
      {!currentSession ? (
        <Auth />
      ) : (
        //   <Account key={currentSession.user.id}
        <DuckiPlayer
          url="https://s186.vidboo.org/6jmn257lqmazsalrixoqb25rkckpcv7uag7uixqzqjb7trtrech5jmvkvxaq/v.mp4"
          // url="https://s196.vidboo.org/6jmnvot2vmazsalriuoqhypmiteb7avnuzzk5abnpuou3ghgvhtvxayxnkyq/v.mp4"
          // url="https://ajye.vizcloud.ink/simple/EqPFIfwQWADtjDlGha7rC5ouqVwVvra2AgR7rqk+wYMnU94US2El/br/list.m3u8"
        ></DuckiPlayer>
      )}
    </div>
  );
}
