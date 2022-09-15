import "./App.css";

import StartUp from "./pages/StartUp";
import { AppContextProvider } from "./context/appContext";

function App() {
  return (
    <div className="App">
      <AppContextProvider>
        <StartUp></StartUp>
      </AppContextProvider>
    </div>
  );
}

export default App;
