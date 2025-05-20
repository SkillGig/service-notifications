import express from "express";
import {
  produceUserNotificationMessage,
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
  "/send-push-notification",
  authenticateUserTokenMiddleware,
  sendPushNotificationToDevice
);

router.post(
  "/produce-user-notification",
  produceUserNotificationMessage
)

export default router;
