// components/layout/Header.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  MapPin,
  Users,
  Droplets,
  Sprout,
  Shield,
  Camera,
} from "lucide-react";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const modules = [
    {
      id: "gps",
      name: "GPS Tracking",
      icon: MapPin,
      status: "online",
      developer: "Nelson Chingaipe",
    },
    {
      id: "biometric",
      name: "Biometric System",
      icon: Users,
      status: "online",
      developer: "Ebenezer Mulela",
    },
    {
      id: "pump",
      name: "Smart Pumping",
      icon: Droplets,
      status: "online",
      developer: "Li-David Mumba",
    },
    {
      id: "irrigation",
      name: "Smart Irrigation",
      icon: Sprout,
      status: "warning",
      developer: "Chibwanta & Taonga",
    },
    {
      id: "fence",
      name: "Smart Fence",
      icon: Shield,
      status: "online",
      developer: "Nchimunya Sichilima",
    },
    {
      id: "surveillance",
      name: "Surveillance",
      icon: Camera,
      status: "offline",
      developer: "Christ Mulenga",
    },
  ];

  const handleModuleClick = (moduleId) => {
    navigate(`/dashboard/modules/${moduleId}`);
  };

  // Get current module based on URL
  const currentModule = modules.find((m) =>
    location.pathname.includes(`/modules/${m.id}`)
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentModule ? currentModule.name : "Farm Operations Dashboard"}
            </h2>
            <p className="text-sm text-gray-600">
              {currentModule
                ? "Module Control Panel"
                : "Real-time monitoring and control system"}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleClick(module.id)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors relative group ${
                location.pathname === `/dashboard/modules/${module.id}`
                  ? "bg-green-100 border-green-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <module.icon className="w-4 h-4 text-gray-600" />
              <div
                className={`w-2 h-2 rounded-full ml-2 ${
                  module.status === "online"
                    ? "bg-green-500"
                    : module.status === "warning"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
              {/* Fast tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none whitespace-nowrap z-10">
                {module.name}
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">SM</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
