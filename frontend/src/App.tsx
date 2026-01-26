// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/landingPage";
import ContentGeneration from "./pages/content-generation/ContentGeneration";
import TrendsGeneration from "./pages/trends-generation/TrendsGeneration";
import MarketingDashboard from "./pages/marketing-dashboard/MarketingDashboard";
import ComingSoonPage from "./pages/ComingSoonPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
          <Route path="/generator" element={<ContentGeneration />} />
          <Route path="/trends" element={<TrendsGeneration />} />
          <Route path="/ComingSoonPage" element={<ComingSoonPage title={""} desc={""} />} />
          <Route path="/marketing-dashboard" element={<MarketingDashboard />} />
          
      </Routes>
    </BrowserRouter>
  );
}
