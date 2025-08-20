// server/routes/api/v1/topics.route.js
import express from "express";
import mqttService from "../../../services/mqtt.service.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    topics: mqttService.getTopics(),
  });
});

export default router;
