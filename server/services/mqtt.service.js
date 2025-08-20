// server/services/mqtt.service.js
import mqtt from "mqtt";
import Device from "../models/Device.model.js";
import Topic from "../models/Topic.model.js";

class MQTTService {
  constructor() {
    this.client = null;
    this.connectedDevices = new Map();
    this.topics = new Map();
    this.messageCount = 0;
    this.systemStats = {
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      memoryUsage: process.memoryUsage(),
    };
  }

  connect() {
    this.client = mqtt.connect("mqtt://localhost:1883", {
      clientId: `iot-gateway-${Date.now()}`,
      clean: true,
      reconnectPeriod: 1000,
    });

    this.client.on("connect", () => {
      console.log("Connected to MQTT broker");
      this.subscribeToTopics();
    });

    this.client.on("message", this.handleMessage.bind(this));
    this.client.on("error", this.handleError.bind(this));
  }

  subscribeToTopics() {
    // Subscribe to all device topics
    this.client.subscribe("devices/#", { qos: 1 }, (err) => {
      if (!err) console.log("Subscribed to devices/#");
    });

    // Subscribe to system topics
    this.client.subscribe("$SYS/#", { qos: 0 }, (err) => {
      if (!err) console.log("Subscribed to system topics");
    });
  }

  handleMessage(topic, payload) {
    this.messageCount++;
    const message = payload.toString();

    // Update system stats periodically
    if (Date.now() - this.lastStatsUpdate > 5000) {
      this.updateSystemStats();
    }

    if (topic.startsWith("devices/")) {
      this.processDeviceMessage(topic, message);
    } else if (topic.startsWith("$SYS/")) {
      this.processSystemMessage(topic, message);
    }

    this.updateTopic(topic, message);
  }

  processDeviceMessage(topic, message) {
    try {
      const [_, deviceId, messageType] = topic.split("/");
      const data = JSON.parse(message);

      let device = this.connectedDevices.get(deviceId);
      if (!device) {
        device = new Device(deviceId);
        this.connectedDevices.set(deviceId, device);
      }

      device.update({
        status: "connected",
        lastSeen: new Date(),
        [messageType]: data,
      });

      // Update topics for this device
      if (!device.topics.includes(topic)) {
        device.topics.push(topic);
      }
    } catch (error) {
      console.error("Error processing device message:", error);
    }
  }

  updateSystemStats() {
    this.systemStats = {
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      memoryUsage: process.memoryUsage(),
      lastUpdated: new Date(),
    };
  }

  getStatus() {
    return {
      status: this.client?.connected ? "active" : "connecting",
      stats: {
        clients: this.connectedDevices.size,
        messages: this.messageCount,
        uptime: `${Math.floor(this.systemStats.uptime / 60)}m ${Math.floor(
          this.systemStats.uptime % 60
        )}s`,
        cpuUsage: `${(
          (this.systemStats.cpuUsage.user + this.systemStats.cpuUsage.system) /
          1000000
        ).toFixed(1)}%`,
        memoryUsage: `${(
          this.systemStats.memoryUsage.rss /
          1024 /
          1024
        ).toFixed(1)}MB`,
      },
    };
  }

  getDevices() {
    return Array.from(this.connectedDevices.values()).map((device) =>
      device.toJSON()
    );
  }

  getTopics() {
    return Array.from(this.topics.values()).map((topic) => topic.toJSON());
  }
}

export default new MQTTService();
