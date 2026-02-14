import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import App from "./app/App.tsx";
import { LandingPage } from "./app/components/LandingPage";
import "./styles/index.css";
import { AuthProvider } from "./app/context/AuthContext";

function LandingWrapper() {
  const navigate = useNavigate();
  return <LandingPage onGetStarted={() => navigate("/dashboard")} />;
}

import { Toaster } from "./app/components/ui/sonner";
import { DashboardProvider } from "./app/context/DashboardContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider
      children={
        <>
          <DashboardProvider>
            <Routes>
              <Route path="/" element={<LandingWrapper />} />
              <Route path="/*" element={<App />} />
            </Routes>
            <Toaster />
          </DashboardProvider>
        </>
      }
    />
  </BrowserRouter>
);
  