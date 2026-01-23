// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard";
import ContentGeneration from "./pages/content-generation/ContentGeneration";
import TrendsGeneration from "./pages/trends-generation/TrendsGeneration";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
          <Route path="/generator" element={<ContentGeneration />} />
          <Route path="/trends" element={<TrendsGeneration />} />
          
      </Routes>
    </BrowserRouter>
  );
}
