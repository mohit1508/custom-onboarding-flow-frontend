import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding.tsx";
import Admin from "./pages/Admin.tsx";
import Data from "./pages/Data.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/data" element={<Data />} />
      </Routes>
    </Router>
  );
};

export default App;
