import React from "react";
import Wizard from "../components/Wizard.tsx";

const Onboarding: React.FC = () => {
  return (
    <div className="h-[calc(100vh-76px)] flex items-center justify-center p-4">
      <Wizard />
    </div>
  );
};

export default Onboarding;
