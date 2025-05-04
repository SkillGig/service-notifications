import express from "express";
import {
  registerNewDeviceToken,
  sendPushNotificationToDevice,
} from "../controllers/notifications.controller.js";
import { authenticateUserTokenMiddleware } from "../middlewares/auth.handler.js";

const router = express.Router();

router.post(
  "/register-token",
  authenticateUserTokenMiddleware,
  registerNewDeviceToken
);

router.post(
  "/send-notification",
  authenticateUserTokenMiddleware,
  sendPushNotificationToDevice
);

export default router;
