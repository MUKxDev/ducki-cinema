import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Rooms from "./routes/Rooms";
import Account from "./pages/Account";
import NotFound from "./routes/NotFound";
import { AppContextProvider } from "./context/appContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="rooms/:id" element={<Rooms />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
