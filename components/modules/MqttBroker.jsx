// components/modules/MqttBroker.jsx
import React, { useState, useEffect } from "react";
import {
  Server,
  Wifi,
  Activity,
  Cpu,
  Clock,
  RefreshCw,
  Power,
  HardDrive,
} from "lucide-react";

const MqttBroker = () => {
  // Broker state
  const [brokerStatus, setBrokerStatus] = useState("connecting");
  const [connectionStats, setConnectionStats] = useState({
    clients: 0,
    messages: 0,
    uptime: "0s",
    cpuUsage: "0%",
    memoryUsage: "0MB",
  });
  const [topics, setTopics] = useState([]);
  const [esp32Clients, setEsp32Clients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Fallback mock data for development
  const mockEsp32Clients = [
    {
      id: "esp32-gps",
      ip: "192.168.1.101",
      status: "connected",
      lastSeen: "2s ago",
      topics: ["farm/gps/updates"],
    },
    {
      id: "esp32-biometric",
      ip: "192.168.1.102",
      status: "connected",
      lastSeen: "5s ago",
      topics: ["farm/biometric/checkins"],
    },
    {
      id: "esp32-pump",
      ip: "192.168.1.103",
      status: "connected",
      lastSeen: "3s ago",
      topics: ["farm/pump/status"],
    },
    {
      id: "esp32-irrigation",
      ip: "192.168.1.104",
      status: "disconnected",
      lastSeen: "5m ago",
      topics: ["farm/irrigation/control"],
    },
    {
      id: "esp32-fence",
      ip: "192.168.1.105",
      status: "connected",
      lastSeen: "1s ago",
      topics: ["farm/fence/alerts"],
    },
  ];

  const mockTopics = [
    {
      name: "farm/gps/updates",
      messages: 420,
      subscribers: 2,
      publisher: "esp32-gps",
    },
    {
      name: "farm/biometric/checkins",
      messages: 300,
      subscribers: 1,
      publisher: "esp32-biometric",
    },
    {
      name: "farm/pump/status",
      messages: 200,
      subscribers: 1,
      publisher: "esp32-pump",
    },
    {
      name: "farm/irrigation/control",
      messages: 180,
      subscribers: 1,
      publisher: "esp32-irrigation",
    },
    {
      name: "farm/fence/alerts",
      messages: 150,
      subscribers: 2,
      publisher: "esp32-fence",
    },
  ];

  useEffect(() => {
    // Connect to WebSocket
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:4000");
      setSocket(ws);

      ws.onopen = () => {
        console.log("Connected to gateway WebSocket");
        setIsLoading(false);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "INIT":
            setBrokerStatus(data.status.status);
            setConnectionStats(data.status.stats);
            setEsp32Clients(data.devices);
            setTopics(data.topics);
            break;

          case "STATUS_UPDATE":
            setBrokerStatus(data.status.status);
            setConnectionStats(data.status.stats);
            setEsp32Clients(data.devices);
            setTopics(data.topics);
            break;

          case "MQTT_MESSAGE":
            handleRealTimeUpdate(data.topic, data.message);
            break;
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setBrokerStatus("error");
        // Fallback to mock data in development
        if (process.env.NODE_ENV === "development") {
          useMockData();
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setBrokerStatus("disconnected");
        // Attempt to reconnect
        setTimeout(connectWebSocket, 5000);
      };

      return ws;
    };

    const useMockData = () => {
      setBrokerStatus("active");
      setConnectionStats({
        clients: mockEsp32Clients.filter((c) => c.status === "connected")
          .length,
        messages: mockTopics.reduce((sum, topic) => sum + topic.messages, 0),
        uptime: "2h 45m",
        cpuUsage: "32%",
        memoryUsage: "256MB",
      });
      setTopics(mockTopics);
      setEsp32Clients(mockEsp32Clients);
      setIsLoading(false);
    };

    const ws = connectWebSocket();

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleRealTimeUpdate = (topic, message) => {
    try {
      // Update specific device if this is a device topic
      if (topic.startsWith("devices/")) {
        const deviceId = topic.split("/")[1];
        const messageData = JSON.parse(message);

        setEsp32Clients((prevDevices) =>
          prevDevices.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  lastSeen: "just now",
                  status: "connected",
                  ...messageData,
                }
              : device
          )
        );
      }

      // Update message count
      setConnectionStats((prev) => ({
        ...prev,
        messages: prev.messages + 1,
      }));

      // Update topic stats
      setTopics((prevTopics) => {
        const topicIndex = prevTopics.findIndex((t) => t.name === topic);
        if (topicIndex >= 0) {
          const updatedTopics = [...prevTopics];
          updatedTopics[topicIndex] = {
            ...updatedTopics[topicIndex],
            messages: updatedTopics[topicIndex].messages + 1,
            lastUpdated: new Date().toISOString(),
          };
          return updatedTopics;
        }
        return prevTopics;
      });
    } catch (error) {
      console.error("Error processing real-time update:", error);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "REFRESH" }));
    } else {
      // Fallback if WebSocket isn't available
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleRestartBroker = () => {
    setBrokerStatus("restarting");
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "COMMAND",
          data: {
            deviceId: "broker",
            command: "restart",
          },
        })
      );
    }
    setTimeout(() => setBrokerStatus("active"), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              MQTT Broker (ESP32 Pub/Sub)
            </h1>
            <p className="text-gray-600">
              Local broker for ESP32 modules using publish/subscribe
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={handleRestartBroker}
              disabled={brokerStatus === "restarting"}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Power className="w-4 h-4 mr-2" />
              {brokerStatus === "restarting" ? "Restarting..." : "Restart"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Broker Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Broker Status</p>
              <p className="text-1xl font-bold text-gray-900 capitalize">
                {brokerStatus}
                <span
                  className={`ml-2 inline-block w-2 h-2 rounded-full ${
                    brokerStatus === "active"
                      ? "bg-green-500"
                      : brokerStatus === "connecting" ||
                        brokerStatus === "restarting"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 text-green-600">
              <Server className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Connected ESP32s */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Connected ESP32s</p>
              <p className="text-2xl font-bold text-gray-900">
                {esp32Clients.filter((c) => c.status === "connected").length}/
                {esp32Clients.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 text-blue-600">
              <Wifi className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {connectionStats.messages}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 text-purple-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">
                {connectionStats.uptime}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* System Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">System Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                {connectionStats.cpuUsage} / {connectionStats.memoryUsage}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 text-red-600">
              <Cpu className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ESP32 Clients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">ESP32 Clients</h3>
          <p className="text-sm text-gray-600">
            Connected modules using pub/sub
          </p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topics
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {esp32Clients.map((client, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.status === "connected"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.lastSeen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.topics.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pub/Sub Topics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Pub/Sub Topics
          </h3>
          <p className="text-sm text-gray-600">
            Active MQTT topics and their publishers
          </p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publisher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topics.map((topic, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {topic.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {topic.publisher}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {topic.subscribers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {topic.messages}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Connection Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Connection Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Broker Address</p>
            <p className="font-mono">mqtt://{window.location.hostname}:1883</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">WebSocket Port</p>
            <p className="font-mono">ws://{window.location.hostname}:4000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MqttBroker;
