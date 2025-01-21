import React from "react";
import Wizard from "../components/Wizard.tsx";

const Onboarding: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center p-4">
      <Wizard />
    </div>
  );
};

export default Onboarding;
