// server/sockets/gateway.socket.js
import { WebSocketServer } from "ws";
import mqttService from "../services/mqtt.service.js";

export default function createWebSocketServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket client connected");

    // Send initial state
    ws.send(
      JSON.stringify({
        type: "INIT",
        status: mqttService.getStatus(),
        devices: mqttService.getDevices(),
        topics: mqttService.getTopics(),
      })
    );

    // Handle messages from frontend
    ws.on("message", (message) => {
      try {
        const { type, data } = JSON.parse(message);

        switch (type) {
          case "REFRESH":
            ws.send(
              JSON.stringify({
                type: "STATUS_UPDATE",
                status: mqttService.getStatus(),
                devices: mqttService.getDevices(),
                topics: mqttService.getTopics(),
              })
            );
            break;

          case "COMMAND":
            mqttService.client.publish(
              `commands/${data.deviceId}`,
              JSON.stringify(data.command)
            );
            break;
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    // Forward MQTT messages to frontend
    const messageHandler = (topic, message) => {
      ws.send(
        JSON.stringify({
          type: "MQTT_MESSAGE",
          topic,
          message: message.toString(),
        })
      );
    };

    mqttService.client.on("message", messageHandler);

    // Cleanup on disconnect
    ws.on("close", () => {
      mqttService.client.off("message", messageHandler);
      console.log("Client disconnected");
    });
  });

  return wss;
}
