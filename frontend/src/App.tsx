// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/landingPage";
import ContentGeneration from "./pages/content-generation/ContentGeneration";
import TrendsGeneration from "./pages/trends-generation/TrendsGeneration";
import MarketingDashboard from "./pages/marketing-dashboard/MarketingDashboard";

import DraftGeneration from "./pages/draft-generation/DraftGeneration";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
          <Route path="/content-generator" element={<ContentGeneration />} />
          <Route path="/trends" element={<TrendsGeneration />} />
          <Route path="/draft-generator" element={<DraftGeneration />} />

          <Route path="/marketing-dashboard" element={<MarketingDashboard />} />
          
      </Routes>
    </BrowserRouter>
  );
}
