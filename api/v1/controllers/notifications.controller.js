import logger from "../../../config/logger.js";
import admin from "../../../firebase/admin.js";
import { producer } from "../../../kafka/kafkaClient.js";
import { sendApiError, sendApiResponse } from "../helpers/api.helper.js";
import {
  addUserDeviceToken,
  deleteDeviceToken,
  findDeviceTokenForUserId,
} from "../services/notifications.query.js";

export const registerNewDeviceToken = async (req, res) => {
  const userId = req.user.userId;
  const deviceToken = req.headers["device-token"];
  const platform = req.headers.platform;
  const userType = req.headers["user-type"];

  try {
    await addUserDeviceToken(userId, deviceToken, platform, userType);
    return sendApiResponse(res, {});
  } catch (err) {
    logger.error(err, `error being received: [registerNewDeviceToken]`);
    return sendApiError(res, { action: "try_generating_new_device_token" });
  }
};

export const sendPushNotificationToDevice = async (req, res) => {
  const userId = req.body.userId;
  const userType = req.headers["user-type"];
  const { title, body, imageUrl, actionUrl } = req.body;

  try {
    const userDeviceTokenResult = await findDeviceTokenForUserId(
      userId,
      userType
    );

    if (userDeviceTokenResult.length === 0)
      return sendApiError(res, { action: "try_generating_new_device_token" });

    const tokens = userDeviceTokenResult.map((row) => row.deviceToken);

    const payload = {
      notification: {
        title,
        body,
        imageUrl: imageUrl || undefined,
      },
      data: {
        actionUrl: actionUrl || "",
      },
    };

    logger.debug(payload, `data being received: [theNotificationPayload]`);
    logger.debug(tokens, `data being received: [deviceTokens]`);

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      ...payload,
    });

    response.responses.forEach(async (resp, i) => {
      if (!resp.success) {
        const errorCode = resp.error.code;
        if (errorCode === "messaging/registration-token-not-registered") {
          await deleteDeviceToken(tokens[i]);
        }
      }
    });

    logger.debug(
      response.responses,
      `data being received: [response.responses]`
    );

    return sendApiResponse(res, {
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (err) {
    logger.error("Notification error:", err);
    return sendApiError(res, { message: "Failed to send notification" });
  }
};

export const produceUserNotificationMessage = async (req, res) => {
  try {
    const {
      userId,
      roadmapCourseId,
      sectionId,
      moduleWeek,
      contentRefId,
      title,
      body,
      actionUrl,
      type,
      source,
    } = req.body;

    await producer.send({
      topic: "user-notifications",
      messages: [
        {
          key: `user-${userId}`,
          value: JSON.stringify({
            userId,
            roadmapCourseId,
            sectionId,
            moduleWeek,
            contentRefId,
            title,
            body,
            actionUrl,
            type,
            source,
          }),
        },
      ],
    });

    return sendApiResponse(res, {
      notifyUser: "Notification message produced",
    });
  } catch (err) {
    logger.error(err, "[produceUserNotificationMessage]");
    return sendApiError(res, { error: "Failed to produce notification" });
  }
};
