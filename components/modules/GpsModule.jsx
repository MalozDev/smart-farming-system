// components/modules/GpsModule.jsx
import React from "react";
import GenericPage from "../../utils/GenericPage";
import { MapPin } from "lucide-react";

const GpsModule = () => {
  return (
    <GenericPage
      title="GPS Tracking"
      description="Monitor GPS trackers embedded in key farm equipment and employee wristbands"
      icon={<MapPin className="w-8 h-8 text-green-600" />}
    >
      {/* GPS module specific content */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">Active Trackers</h3>
        {/* Add GPS specific content here */}
      </div>
    </GenericPage>
  );
};

export default GpsModule;
