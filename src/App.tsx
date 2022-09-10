import "./App.css";
import { AppContextProvider, useAppContext } from "./context/appContext";
import Auth from "./components/Auth";
import Account from "./pages/Account";

function App() {
  const { currentSession } = useAppContext();

  return (
    <AppContextProvider>
      <div className="App">
        <div className="">
          {!currentSession ? (
            <Auth />
          ) : (
            <Account key={currentSession.user.id} />
          )}
        </div>
      </div>
    </AppContextProvider>
  );
}

export default App;
