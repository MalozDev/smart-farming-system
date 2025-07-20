// components/modules/FenceModule.jsx
import React from "react";
import GenericPage from "../../utils/GenericPage";
import { Shield } from "lucide-react";

const FenceModule = () => {
  return (
    <GenericPage
      title="Smart Fence"
      description="Detects potential intrusions or damage using vibration sensors"
      icon={<Shield className="w-8 h-8 text-green-600" />}
    >
      {/* Fence module specific content */}
    </GenericPage>
  );
};

export default FenceModule;
