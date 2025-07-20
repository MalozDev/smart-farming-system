// components/modules/SurveillanceModule.jsx
import React from "react";
import GenericPage from "../../utils/GenericPage";
import { Camera } from "lucide-react";

const SurveillanceModule = () => {
  return (
    <GenericPage
      title="Surveillance System"
      description="Manages camera feeds to monitor farm activity and security"
      icon={<Camera className="w-8 h-8 text-green-600" />}
    >
      {/* Surveillance module specific content */}
    </GenericPage>
  );
};

export default SurveillanceModule;
