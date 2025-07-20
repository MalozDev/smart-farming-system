// components/modules/Overview.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  Droplets,
  Sprout,
  Shield,
  Camera,
  Wifi,
  Activity,
  AlertTriangle,
  TrendingUp,
  Signal,
  Clock,
} from "lucide-react";

const Overview = () => {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Mock data
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

  const stats = [
    {
      label: "Connected Modules",
      value: "6/7",
      rawValue: 6,
      total: 7,
      icon: Wifi,
      color: "text-green-600",
    },
    {
      label: "MQTT Messages/min",
      value: "1,247",
      rawValue: 1247,
      icon: Activity,
      color: "text-blue-600",
    },
    {
      label: "Active Alerts",
      value: "3",
      rawValue: 3,
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      label: "System Uptime",
      value: "99.8%",
      rawValue: 99.8,
      icon: TrendingUp,
      color: "text-green-600",
    },
  ];

  const recentActivity = [
    {
      time: "2 min ago",
      message: "Irrigation system activated in Zone A",
      type: "success",
    },
    {
      time: "5 min ago",
      message: "GPS tracker GPS001 moved outside boundary",
      type: "warning",
    },
    { time: "12 min ago", message: "Employee EMP005 checked in", type: "info" },
    {
      time: "18 min ago",
      message: "Fence vibration detected at Section 3",
      type: "error",
    },
    {
      time: "25 min ago",
      message: "Water pump P002 completed cycle",
      type: "success",
    },
  ];

  // Animation function for counting numbers
  const animateNumber = (start, end, duration, callback) => {
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeOutQuart;

      callback(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  // Format animated values
  const formatAnimatedValue = (value, originalValue) => {
    if (originalValue.includes("%")) {
      return `${value.toFixed(1)}%`;
    } else if (originalValue.includes("/")) {
      return `${Math.round(value)}/7`;
    } else if (originalValue.includes(",")) {
      return Math.round(value).toLocaleString();
    } else {
      return Math.round(value).toString();
    }
  };

  useEffect(() => {
    // Trigger fade-in animation
    setIsVisible(true);

    // Animate stats with staggered delays
    stats.forEach((stat, index) => {
      setTimeout(() => {
        animateNumber(0, stat.rawValue, 1500, (currentValue) => {
          setAnimatedStats((prev) => ({
            ...prev,
            [index]: formatAnimatedValue(currentValue, stat.value),
          }));
        });
      }, index * 200); // Stagger each stat by 200ms
    });
  }, []);

  const handleModuleClick = (moduleId) => {
    navigate(`/dashboard/modules/${moduleId}`);
  };

  return (
    <div
      className={`transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 transform transition-all duration-700 ${
              isVisible ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {animatedStats[index] || "0"}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg bg-gray-50 ${stat.color} transform transition-transform duration-500`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Modules Section */}
        <div
          className={`lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Connected Modules
            </h3>
            <p className="text-sm text-gray-600">
              Real-time status of all IoT modules
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className={`border border-gray-200 rounded-lg p-4 cursor-pointer transition-shadow duration-200 hover:shadow-md ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  } hover:border-green-300`}
                  style={{
                    transitionDelay: `${800 + index * 100}ms`,
                    transitionProperty: "transform, opacity, box-shadow", // Explicitly specify what to transition
                  }}
                  onClick={() => handleModuleClick(module.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <module.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900">
                          {module.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {module.developer}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        module.status === "online"
                          ? "bg-green-100 text-green-800"
                          : module.status === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-1 animate-pulse ${
                          module.status === "online"
                            ? "bg-green-500"
                            : module.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                      {module.status}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Signal className="w-4 h-4 mr-1" />
                    <span>MQTT Connected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div
          className={`bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-600">Latest system events</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-start transform transition-all duration-500 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${1000 + index * 100}ms` }}
                >
                  <div
                    className={`p-1 rounded-full mr-3 mt-1 ${
                      activity.type === "success"
                        ? "bg-green-100"
                        : activity.type === "warning"
                        ? "bg-yellow-100"
                        : activity.type === "error"
                        ? "bg-red-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                          ? "bg-yellow-500"
                          : activity.type === "error"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MQTT Broker Status Section */}
      <div
        className={`mt-6 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "1200ms" }}
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            MQTT Broker Status
          </h3>
          <p className="text-sm text-gray-600">
            Message broker performance and statistics
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                value: "Active",
                label: "Broker Status",
                color: "text-green-600",
              },
              {
                value: "6",
                label: "Connected Clients",
                color: "text-blue-600",
              },
              {
                value: "247",
                label: "Active Topics",
                color: "text-purple-600",
              },
              {
                value: "1.2K",
                label: "Messages/min",
                color: "text-orange-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-500 ${
                  isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                style={{ transitionDelay: `${1400 + index * 100}ms` }}
              >
                <div className={`text-2xl font-bold ${item.color}`}>
                  {item.value}
                </div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
