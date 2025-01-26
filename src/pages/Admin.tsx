import React from "react";
import AdminPanel from "../components/AdminPanel.tsx";

const Admin: React.FC = () => {
  return (
    <div className="h-[calc(100vh-76px)] flex items-center justify-center p-4">
      <AdminPanel />
    </div>
  );
};

export default Admin;
