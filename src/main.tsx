import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import App from "./app/App.tsx";
import { LandingPage } from "./app/components/LandingPage";
import "./styles/index.css";
import { AuthProvider } from "./app/context/AuthContext";

function LandingWrapper() {
  const navigate = useNavigate();
  return <LandingPage onGetStarted={() => navigate("/chat")} />;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingWrapper />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
);
  