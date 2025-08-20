// server/index.js
import express from "express";
import http from "http";
import cors from "cors";
import mqttService from "./services/mqtt.service.js";
import createWebSocketServer from "./sockets/gateway.socket.js";
import devicesRouter from "./routes/api/v1/devices.route.js";
import topicsRouter from "./routes/api/v1/topics.route.js";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/v1/devices", devicesRouter);
app.use("/api/v1/topics", topicsRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    mqtt: mqttService.client?.connected ? "connected" : "disconnected",
  });
});

// Initialize services
mqttService.connect();
createWebSocketServer(server);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MQTT Gateway ready at http://localhost:${PORT}`);
});
