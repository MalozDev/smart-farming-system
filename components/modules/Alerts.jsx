// components/alerts/AlertSystem.jsx
import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Bell,
  BellOff,
  X,
  Settings,
  Filter,
  Search,
  Calendar,
  MapPin,
  Thermometer,
  Droplets,
  Zap,
  Wifi,
  Battery,
  Shield,
  Clock,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
} from "lucide-react";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Mock alert data
  const mockAlerts = [
    {
      id: 1,
      type: "critical",
      title: "Irrigation System Failure",
      message:
        "Main irrigation pump has stopped responding. Immediate attention required.",
      location: "Sector A - Field 3",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      module: "irrigation",
      severity: "high",
      status: "active",
      icon: Droplets,
      actionRequired: true,
    },
    {
      id: 2,
      type: "warning",
      title: "High Temperature Alert",
      message: "Temperature in greenhouse has exceeded optimal range (32°C).",
      location: "Greenhouse B",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      module: "climate",
      severity: "medium",
      status: "active",
      icon: Thermometer,
      actionRequired: false,
    },
    {
      id: 3,
      type: "info",
      title: "Scheduled Maintenance Complete",
      message: "GPS tracking system maintenance completed successfully.",
      location: "All Sectors",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      module: "gps",
      severity: "low",
      status: "resolved",
      icon: CheckCircle,
      actionRequired: false,
    },
    {
      id: 4,
      type: "warning",
      title: "Low Battery Warning",
      message: "Sensor battery level below 20% in multiple devices.",
      location: "Sector C - Zone 2",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      module: "power",
      severity: "medium",
      status: "active",
      icon: Battery,
      actionRequired: true,
    },
    {
      id: 5,
      type: "critical",
      title: "Security Breach Detected",
      message: "Unauthorized access detected at perimeter fence.",
      location: "North Perimeter - Gate 4",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      module: "security",
      severity: "high",
      status: "investigating",
      icon: Shield,
      actionRequired: true,
    },
    {
      id: 6,
      type: "info",
      title: "Data Sync Completed",
      message: "Daily sensor data synchronization completed successfully.",
      location: "Central Server",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      module: "system",
      severity: "low",
      status: "resolved",
      icon: Wifi,
      actionRequired: false,
    },
    {
      id: 7,
      type: "warning",
      title: "Soil Moisture Alert",
      message: "Soil moisture levels are critically low in multiple zones.",
      location: "Sector B - Multiple Zones",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      module: "irrigation",
      severity: "medium",
      status: "active",
      icon: Droplets,
      actionRequired: true,
    },
    {
      id: 8,
      type: "critical",
      title: "Power Grid Fluctuation",
      message:
        "Abnormal power fluctuations detected. Backup systems activated.",
      location: "Main Distribution Panel",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      module: "power",
      severity: "high",
      status: "active",
      icon: Zap,
      actionRequired: true,
    },
  ];

  // Alert type configurations
  const alertConfig = {
    critical: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      badgeColor: "bg-red-100 text-red-800",
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      badgeColor: "bg-yellow-100 text-yellow-800",
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      badgeColor: "bg-green-100 text-green-800",
    },
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  // Handle alert actions
  const handleAlertAction = (alertId, action) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: action === "resolve" ? "resolved" : "investigating",
            }
          : alert
      )
    );
  };

  // Filter alerts
  const filterAlerts = () => {
    let filtered = alerts;

    // Filter by type
    if (activeFilter !== "all") {
      filtered = filtered.filter((alert) =>
        activeFilter === "active"
          ? alert.status === "active"
          : activeFilter === "resolved"
          ? alert.status === "resolved"
          : alert.type === activeFilter
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  };

  // Refresh alerts
  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      // Simulate new alerts or updates
      const updatedAlerts = mockAlerts.map((alert) => ({
        ...alert,
        timestamp: Math.random() > 0.7 ? new Date() : alert.timestamp,
      }));

      setAlerts(updatedAlerts);
      setIsRefreshing(false);
    }, 1000);
  };

  // Export alerts
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Type,Title,Message,Location,Timestamp,Module,Severity,Status\n" +
      filteredAlerts
        .map(
          (alert) =>
            `${alert.id},${alert.type},${alert.title},"${alert.message}",${
              alert.location
            },${alert.timestamp.toISOString()},${alert.module},${
              alert.severity
            },${alert.status}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `alerts_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Initialize and filter alerts
  useEffect(() => {
    setAlerts(mockAlerts);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, activeFilter, searchTerm]);

  // Alert counts
  const alertCounts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.type === "critical").length,
    warning: alerts.filter((a) => a.type === "warning").length,
    active: alerts.filter((a) => a.status === "active").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  };

  return (
    <div
      className={`transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Alert Management
            </h1>
            <p className="text-gray-600">
              Monitor and manage system alerts and notifications
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                notificationsEnabled
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {notificationsEnabled ? (
                <Bell className="w-4 h-4 mr-2" />
              ) : (
                <BellOff className="w-4 h-4 mr-2" />
              )}
              {notificationsEnabled ? "Notifications On" : "Notifications Off"}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(alertCounts).map(([key, count]) => (
            <div
              key={key}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                activeFilter === key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setActiveFilter(key)}
            >
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
            <div className="flex space-x-2">
              {["all", "critical", "warning", "active", "resolved"].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      activeFilter === filter
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No alerts found
            </h3>
            <p className="text-gray-600">
              No alerts match your current filters.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const config = alertConfig[alert.type] || alertConfig.info;
            const IconComponent = alert.icon;

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl shadow-sm border-l-4 ${
                  config.borderColor
                } transform transition-all duration-500 hover:shadow-md ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <IconComponent
                          className={`w-6 h-6 ${config.iconColor}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {alert.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${config.badgeColor}`}
                          >
                            {alert.type}
                          </span>
                          {alert.actionRequired && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Action Required
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {alert.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTimestamp(alert.timestamp)}
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            {alert.module}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {alert.status === "active" && (
                        <>
                          <button
                            onClick={() =>
                              handleAlertAction(alert.id, "investigate")
                            }
                            className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                          >
                            Investigate
                          </button>
                          <button
                            onClick={() =>
                              handleAlertAction(alert.id, "resolve")
                            }
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Alert Details
                </h2>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-lg ${
                    alertConfig[selectedAlert.type].bgColor
                  }`}
                >
                  <selectedAlert.icon
                    className={`w-8 h-8 ${
                      alertConfig[selectedAlert.type].iconColor
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedAlert.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-sm font-medium rounded-full ${
                      alertConfig[selectedAlert.type].badgeColor
                    }`}
                  >
                    {selectedAlert.type}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="text-gray-900">{selectedAlert.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Module
                  </label>
                  <p className="text-gray-900">{selectedAlert.module}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Severity
                  </label>
                  <p className="text-gray-900">{selectedAlert.severity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <p className="text-gray-900">{selectedAlert.status}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Timestamp
                  </label>
                  <p className="text-gray-900">
                    {selectedAlert.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <p className="text-gray-900 mt-1">{selectedAlert.message}</p>
              </div>
              {selectedAlert.actionRequired && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">
                    Action Required
                  </h4>
                  <p className="text-red-700">
                    This alert requires immediate attention and action from the
                    system administrator.
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {selectedAlert.status === "active" && (
                <>
                  <button
                    onClick={() => {
                      handleAlertAction(selectedAlert.id, "investigate");
                      setSelectedAlert(null);
                    }}
                    className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Mark as Investigating
                  </button>
                  <button
                    onClick={() => {
                      handleAlertAction(selectedAlert.id, "resolve");
                      setSelectedAlert(null);
                    }}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Resolve Alert
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
