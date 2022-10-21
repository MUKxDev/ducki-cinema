import Auth from "../components/Auth";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Rooms from "../routes/Rooms";
import Account from "../pages/Account";
import NotFound from "../routes/NotFound";
import { useAppContext } from "../context/appContext";
import Dashboard from "../pages/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function StartUp() {
  const { currentSession } = useAppContext();
  const queryClient = new QueryClient();
  return (
    <div className="w-full">
      {!currentSession ? (
        <Auth />
      ) : (
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="rooms/:id" element={<Rooms />} />
              <Route path="account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      )}
    </div>
  );
}
