// pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Overview from "../components/modules/Overview";
import Modules from "../components/modules/Modules";
import Analytics from "../components/modules/Analytics";
import MqttBroker from "../components/modules/MqttBroker";
import Settings from "../components/modules/SettingsPage";
import GpsModule from "../components/modules/GpsModule";
import BiometricModule from "../components/modules/BiometricModule";
import PumpModule from "../components/modules/PumpModule";
import IrrigationModule from "../components/modules/IrrigationModule";
import FenceModule from "../components/modules/FenceModule";
import SurveillanceModule from "../components/modules/SurveillanceModule";
import Alerts from "../components/modules/Alerts";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Loading effect when route changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // 300ms loading time - adjust as needed

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Routes>
              <Route index element={<Overview />} />
              <Route path="modules" element={<Modules />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="mqtt" element={<MqttBroker />} />
              <Route path="settings" element={<Settings />} />
              <Route path="modules/gps" element={<GpsModule />} />
              <Route path="modules/biometric" element={<BiometricModule />} />
              <Route path="modules/pump" element={<PumpModule />} />
              <Route path="modules/irrigation" element={<IrrigationModule />} />
              <Route path="modules/fence" element={<FenceModule />} />
              <Route path="alerts" element={<Alerts />} />
              <Route
                path="modules/surveillance"
                element={<SurveillanceModule />}
              />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
