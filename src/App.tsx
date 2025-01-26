import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TabsNavigation from "./components/TabNavigation";
import Onboarding from "./pages/Onboarding";
import Admin from "./pages/Admin";
import Data from "./pages/Data";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <TabsNavigation />
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/data" element={<Data />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
