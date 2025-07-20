// components/layout/Sidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Zap,
  TrendingUp,
  Database,
  Settings,
  LogOut,
  AlertTriangle,
} from "lucide-react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  extendedSidebar,
  setExtendedSidebar,
}) => {
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: "Overview",
      onClick: () => setExtendedSidebar(false),
    },
    {
      path: "/dashboard/modules",
      icon: Zap,
      label: "Modules",
      onClick: () => setExtendedSidebar(false),
    },
    {
      path: "/dashboard/analytics",
      icon: TrendingUp,
      label: "Analytics",
      onClick: () => setExtendedSidebar(false),
    },
    {
      path: "/dashboard/alerts",
      icon: AlertTriangle,
      label: "Alerts",
      onClick: () => setExtendedSidebar(false),
    },
    {
      path: "/dashboard/mqtt",
      icon: Database,
      label: "MQTT Broker",
      onClick: () => setExtendedSidebar(false),
    },
    {
      path: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
      onClick: () => setExtendedSidebar(true),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        !navItems
          .slice(1)
          .some((item) => location.pathname.startsWith(item.path))
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={`bg-green-800 text-white transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      } flex flex-col ${extendedSidebar ? "hidden md:flex" : "flex"}`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-green-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <h1 className="font-bold text-lg">SmartFarm</h1>
              <p className="text-green-300 text-xs">IoT Gateway</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={item.onClick}
              className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-green-700 text-white"
                  : "text-green-200 hover:bg-green-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-green-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">SM</span>
          </div>
          {sidebarOpen && (
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">Stephan Malobeka</p>
              <p className="text-xs text-green-300">System Admin</p>
            </div>
          )}
        </div>
        {sidebarOpen && (
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center px-3 py-2 text-green-200 hover:bg-green-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="ml-3">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
