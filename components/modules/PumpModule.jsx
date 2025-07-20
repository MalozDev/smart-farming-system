// components/modules/PumpModule.jsx
import React from "react";
import GenericPage from "../../utils/GenericPage";
import { Droplets } from "lucide-react";

const PumpModule = () => {
  return (
    <GenericPage
      title="Smart Pumping"
      description="Controls water pumps based on tank levels and monitors flow"
      icon={<Droplets className="w-8 h-8 text-green-600" />}
    >
      {/* Pump module specific content */}
    </GenericPage>
  );
};

export default PumpModule;
