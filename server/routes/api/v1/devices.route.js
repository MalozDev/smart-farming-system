// server/routes/api/v1/devices.route.js
import express from "express";
import mqttService from "../../../services/mqtt.service.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    devices: mqttService.getDevices(),
  });
});

router.get("/:deviceId", (req, res) => {
  const device = mqttService
    .getDevices()
    .find((d) => d.id === req.params.deviceId);

  if (!device) {
    return res.status(404).json({
      success: false,
      message: "Device not found",
    });
  }

  res.json({
    success: true,
    device,
  });
});

export default router;
