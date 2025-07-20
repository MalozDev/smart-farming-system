// components/modules/IrrigationModule.jsx
import React from "react";
import GenericPage from "../../utils/GenericPage";
import { Sprout } from "lucide-react";

const IrrigationModule = () => {
  return (
    <GenericPage
      title="Smart Irrigation"
      description="Uses soil moisture sensors to determine irrigation needs"
      icon={<Sprout className="w-8 h-8 text-green-600" />}
    >
      {/* Irrigation module specific content */}
    </GenericPage>
  );
};

export default IrrigationModule;
