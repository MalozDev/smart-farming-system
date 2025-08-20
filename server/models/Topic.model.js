// server/models/Topic.model.js
export default class Topic {
  constructor(name) {
    this.name = name;
    this.messageCount = 0;
    this.subscribers = 1;
    this.lastMessage = "";
    this.lastUpdated = new Date();
    this.publisher = this.detectPublisher();
  }

  detectPublisher() {
    if (this.name.startsWith("devices/")) {
      return this.name.split("/")[1];
    }
    return "system";
  }

  update(message) {
    this.messageCount++;
    this.lastMessage = message;
    this.lastUpdated = new Date();
  }

  toJSON() {
    return {
      name: this.name,
      messages: this.messageCount,
      subscribers: this.subscribers,
      publisher: this.publisher,
      lastUpdated: this.lastUpdated.toISOString(),
    };
  }
}
