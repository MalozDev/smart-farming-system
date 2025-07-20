// components/modules/Analytics.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";

const Analytics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock analytics data
  const stats = [
    {
      label: "Daily Alerts",
      value: "24",
      rawValue: 24,
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      label: "Data Points Collected",
      value: "8,542",
      rawValue: 8542,
      icon: Activity,
      color: "text-blue-600",
    },
    {
      label: "System Uptime",
      value: "99.7%",
      rawValue: 99.7,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Avg Response Time",
      value: "1.2s",
      rawValue: 1.2,
      icon: Clock,
      color: "text-purple-600",
    },
  ];

  const chartData = {
    dailyUsage: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "MQTT Messages",
          data: [1200, 1900, 1700, 2100, 2400, 1800, 1500],
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 2,
        },
      ],
    },
    moduleActivity: {
      labels: [
        "GPS",
        "Biometric",
        "Pump",
        "Irrigation",
        "Fence",
        "Surveillance",
      ],
      datasets: [
        {
          label: "Activity Count",
          data: [420, 300, 200, 180, 150, 100],
          backgroundColor: [
            "rgba(16, 185, 129, 0.7)",
            "rgba(59, 130, 246, 0.7)",
            "rgba(245, 158, 11, 0.7)",
            "rgba(139, 92, 246, 0.7)",
            "rgba(220, 38, 38, 0.7)",
            "rgba(6, 182, 212, 0.7)",
          ],
        },
      ],
    },
  };

  const recentActivities = [
    {
      time: "15 min ago",
      message: "Generated weekly irrigation report",
      type: "success",
    },
    {
      time: "32 min ago",
      message: "Detected unusual activity in GPS module",
      type: "warning",
    },
    {
      time: "1 hour ago",
      message: "Completed daily data aggregation",
      type: "info",
    },
    {
      time: "2 hours ago",
      message: "System backup completed successfully",
      type: "success",
    },
    {
      time: "4 hours ago",
      message: "Performance optimization analysis running",
      type: "info",
    },
  ];

  // Animation function for counting numbers
  const animateNumber = (start, end, duration, callback, onComplete) => {
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
      } else if (onComplete) {
        onComplete();
      }
    };
    requestAnimationFrame(animate);
  };

  // Format animated values
  const formatAnimatedValue = (value, originalValue) => {
    if (originalValue.includes("%")) {
      return `${value.toFixed(1)}%`;
    } else if (originalValue.includes(",")) {
      return Math.round(value).toLocaleString();
    } else {
      return value.toFixed(1).toString();
    }
  };

  // Handle refresh functionality
  const handleRefresh = () => {
    setIsRefreshing(true);

    // Reset animated stats
    setAnimatedStats({});

    // Simulate data refresh (in real app, this would fetch new data)
    setTimeout(() => {
      // Add some randomness to simulate fresh data
      const refreshedStats = stats.map((stat) => ({
        ...stat,
        rawValue: stat.rawValue + (Math.random() - 0.5) * (stat.rawValue * 0.1),
      }));

      // Track completed animations
      let completedAnimations = 0;
      const totalAnimations = refreshedStats.length;

      // Re-animate stats with fresh data
      refreshedStats.forEach((stat, index) => {
        setTimeout(() => {
          animateNumber(
            0,
            stat.rawValue,
            1000,
            (currentValue) => {
              setAnimatedStats((prev) => ({
                ...prev,
                [index]: formatAnimatedValue(currentValue, stat.value),
              }));
            },
            () => {
              // Animation completed callback
              completedAnimations++;
              if (completedAnimations === totalAnimations) {
                // All animations are done, stop refreshing
                setIsRefreshing(false);
              }
            }
          );
        }, index * 150);
      });
    }, 800);
  };

  // Handle export functionality
  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Prepare data for export
      const exportData = {
        exportDate: new Date().toISOString(),
        systemOverview: {
          dailyAlerts: stats[0].rawValue,
          dataPointsCollected: stats[1].rawValue,
          systemUptime: stats[2].rawValue,
          avgResponseTime: stats[3].rawValue,
        },
        dailyUsage: {
          labels: chartData.dailyUsage.labels,
          mqttMessages: chartData.dailyUsage.datasets[0].data,
        },
        moduleActivity: {
          modules: chartData.moduleActivity.labels,
          activityCounts: chartData.moduleActivity.datasets[0].data,
        },
        recentActivities: recentActivities,
      };

      // Convert to CSV format
      const csvContent = generateCSV(exportData);

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `analytics_report_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Generate CSV content
  const generateCSV = (data) => {
    let csv = "Analytics Report\n";
    csv += `Export Date,${data.exportDate}\n\n`;

    csv += "System Overview\n";
    csv += "Metric,Value\n";
    csv += `Daily Alerts,${data.systemOverview.dailyAlerts}\n`;
    csv += `Data Points Collected,${data.systemOverview.dataPointsCollected}\n`;
    csv += `System Uptime,${data.systemOverview.systemUptime}%\n`;
    csv += `Avg Response Time,${data.systemOverview.avgResponseTime}s\n\n`;

    csv += "Daily Usage (MQTT Messages)\n";
    csv += "Day,Messages\n";
    data.dailyUsage.labels.forEach((label, index) => {
      csv += `${label},${data.dailyUsage.mqttMessages[index]}\n`;
    });
    csv += "\n";

    csv += "Module Activity\n";
    csv += "Module,Activity Count\n";
    data.moduleActivity.modules.forEach((module, index) => {
      csv += `${module},${data.moduleActivity.activityCounts[index]}\n`;
    });
    csv += "\n";

    csv += "Recent Activities\n";
    csv += "Time,Message,Type\n";
    data.recentActivities.forEach((activity) => {
      csv += `${activity.time},"${activity.message}",${activity.type}\n`;
    });

    return csv;
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

  return (
    <div
      className={`transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive analytics and reporting for your smart farming
              system
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 active:opacity-80 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export"}
            </button>
          </div>
        </div>
      </div>

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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Usage Chart */}
        <div
          className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Daily System Usage
            </h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-gray-50">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">
                Line chart showing daily MQTT message volume
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {chartData.dailyUsage.labels.join(" • ")}
              </p>
            </div>
          </div>
        </div>

        {/* Module Activity Chart */}
        <div
          className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Module Activity Distribution
            </h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-gray-50">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">
                Pie chart showing module activity distribution
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {chartData.moduleActivity.labels.join(" • ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "1000ms" }}
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Analytics Events
          </h3>
          <p className="text-sm text-gray-600">
            System-generated analytics events
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className={`flex items-start transform transition-all duration-500 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: `${1200 + index * 100}ms` }}
              >
                <div
                  className={`p-1 rounded-full mr-3 mt-1 ${
                    activity.type === "success"
                      ? "bg-green-100"
                      : activity.type === "warning"
                      ? "bg-yellow-100"
                      : "bg-blue-100"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                        ? "bg-yellow-500"
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
  );
};

export default Analytics;
