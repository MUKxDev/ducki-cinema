import "./App.css";
import { AppContextProvider } from "./context/appContext";

import StartUp from "./pages/StartUp";

function App() {
  return (
    <AppContextProvider>
      <div className="App">
        <StartUp></StartUp>
      </div>
    </AppContextProvider>
  );
}

export default App;
