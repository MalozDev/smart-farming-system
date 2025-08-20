// server/models/Device.model.js
export default class Device {
  constructor(id) {
    this.id = id;
    this.ip = this.generateIP();
    this.status = "disconnected";
    this.lastSeen = null;
    this.topics = [];
    this.statusData = {};
    this.sensorData = {};
  }

  generateIP() {
    return `192.168.1.${Math.floor(Math.random() * 100 + 100)}`;
  }

  update(data) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      id: this.id,
      ip: this.ip,
      status: this.status,
      lastSeen: this.formatLastSeen(),
      topics: this.topics,
      ...this.statusData,
      ...this.sensorData,
    };
  }

  formatLastSeen() {
    if (!this.lastSeen) return "never";
    const seconds = Math.floor((new Date() - this.lastSeen) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }
}
