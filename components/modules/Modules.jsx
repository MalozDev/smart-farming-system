// components/modules/Modules.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  Droplets,
  Shield,
  Camera,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Signal,
  Settings,
  Activity,
  Database,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

const Modules = () => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});

  // Animation counter states
  const [totalModules, setTotalModules] = useState(6);
  const [onlineModules, setOnlineModules] = useState(4);
  const [connectedDevices, setConnectedDevices] = useState(49);
  const [avgUptime, setAvgUptime] = useState(96.6);

  // Module data with connectivity and admin info
  const modules = [
    {
      id: "gps",
      name: "GPS Tracking",
      icon: MapPin,
      status: "online",
      developer: "Nelson Chingaipe",
      lastSeen: "2 min ago",
      dataRate: "45 msg/min",
      uptime: "99.2%",
      version: "v2.1.3",
      description:
        "Monitors GPS trackers on farm equipment and employee wristbands",
      mqttTopic: "farm/gps/+",
      connectedDevices: 12,
    },
    {
      id: "biometric",
      name: "Biometric System",
      icon: Users,
      status: "online",
      developer: "Ebenezer Mulela",
      lastSeen: "1 min ago",
      dataRate: "8 msg/min",
      uptime: "98.7%",
      version: "v1.4.2",
      description:
        "Fingerprint authentication system for employee check-in/out",
      mqttTopic: "farm/biometric/auth",
      connectedDevices: 3,
    },
    {
      id: "pump",
      name: "Smart Pumping",
      icon: Droplets,
      status: "online",
      developer: "Li-David Mumba",
      lastSeen: "3 min ago",
      dataRate: "25 msg/min",
      uptime: "99.8%",
      version: "v2.0.1",
      description:
        "Automated water pump control based on tank levels and flow monitoring",
      mqttTopic: "farm/pump/+",
      connectedDevices: 5,
    },
    {
      id: "irrigation",
      name: "Smart Irrigation",
      icon: Droplets,
      status: "warning",
      developer: "Chibwanta & Taonga",
      lastSeen: "15 min ago",
      dataRate: "12 msg/min",
      uptime: "95.3%",
      version: "v1.8.7",
      description:
        "Soil moisture-based irrigation control with zone management",
      mqttTopic: "farm/irrigation/+",
      connectedDevices: 8,
    },
    {
      id: "fence",
      name: "Smart Fence",
      icon: Shield,
      status: "online",
      developer: "Nchimunya Sichilima",
      lastSeen: "1 min ago",
      dataRate: "18 msg/min",
      uptime: "97.1%",
      version: "v1.6.4",
      description:
        "Vibration-based intrusion detection system for perimeter security",
      mqttTopic: "farm/fence/alert",
      connectedDevices: 15,
    },
    {
      id: "surveillance",
      name: "Surveillance",
      icon: Camera,
      status: "offline",
      developer: "Christ Mulenga",
      lastSeen: "2 hours ago",
      dataRate: "0 msg/min",
      uptime: "89.4%",
      version: "v1.2.9",
      description:
        "Camera monitoring system with motion detection and recording",
      mqttTopic: "farm/camera/+",
      connectedDevices: 6,
    },
  ];

  const stats = [
    {
      label: "Total Modules",
      value: "6",
      rawValue: 6,
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Online Modules",
      value: "4",
      rawValue: 4,
      icon: Wifi,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Connected Devices",
      value: "49",
      rawValue: 49,
      icon: Signal,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Avg. Uptime",
      value: "96.8%",
      rawValue: 96.8,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
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
    } else {
      return Math.round(value).toString();
    }
  };

  // Initial load animations
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

  const handleRefresh = () => {
    setRefreshing(true);

    // Reset and re-animate stats
    setAnimatedStats({});

    // Animate stats with staggered delays
    stats.forEach((stat, index) => {
      setTimeout(() => {
        animateNumber(
          0,
          stat.rawValue + Math.random() * 2,
          1500,
          (currentValue) => {
            setAnimatedStats((prev) => ({
              ...prev,
              [index]: formatAnimatedValue(currentValue, stat.value),
            }));
          }
        );
      }, index * 200);
    });

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "offline":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "offline":
        return <WifiOff className="w-4 h-4" />;
      default:
        return <Signal className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`space-y-6 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Module Management
            </h1>
            <p className="text-gray-600 mt-1">
              Overview and administration of all connected IoT modules
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                className={`p-3 rounded-lg ${stat.bgColor} ${stat.color} transform transition-transform duration-500`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module, index) => (
          <div
            key={module.id}
            onClick={() => navigate(`/dashboard/modules/${module.id}`)}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-green-300 transition-all cursor-pointer group transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: `${600 + index * 100}ms` }}
          >
            {/* Module Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-300">
                  <module.icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {module.name}
                  </h3>
                  <p className="text-sm text-gray-600">by {module.developer}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    module.status
                  )}`}
                >
                  {getStatusIcon(module.status)}
                  <span className="ml-1 capitalize">{module.status}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle module settings
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Module Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {module.description}
            </p>

            {/* Module Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Connected Devices
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {module.connectedDevices}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Data Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {module.dataRate}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Uptime</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {module.uptime}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Version</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {module.version}
                  </span>
                </div>
              </div>
            </div>

            {/* Module Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Last seen: {module.lastSeen}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Database className="w-4 h-4 mr-1" />
                <span>{module.mqttTopic}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modules;
