// components/modules/BiometricModule.jsx
import React from "react";
import GenericPage from "../../utils/GenericPage";
import { Users } from "lucide-react";

const BiometricModule = () => {
  return (
    <GenericPage
      title="Biometric System"
      description="Employee authentication using fingerprint technology"
      icon={<Users className="w-8 h-8 text-green-600" />}
    >
      {/* Biometric module specific content */}
    </GenericPage>
  );
};

export default BiometricModule;
