import { query } from "../../../config/db.js";
import logger from "../../../config/logger.js";

export const addUserDeviceToken = async (
  userId,
  deviceToken,
  platform,
  userType
) => {
  logger.debug(
    userId,
    deviceToken,
    platform,
    userType,
    `data being received: [addUserDeviceToken]`
  );

  const queryString = `
      INSERT INTO user_device_tokens (user_id, device_token, platform, user_type)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE last_seen = CURRENT_TIMESTAMP
    `;
  try {
    const result = await query(queryString, [
      userId,
      deviceToken,
      platform,
      userType,
    ]);

    return result;
  } catch (err) {
    logger.error(err, `error being received: [addUserDeviceToken]`);
    throw err;
  }
};

export const findDeviceTokenForUserId = async (userId, userType) => {
  logger.debug(userId, userType, `data being received: [findDeviceTokenForUserId]`);
  const queryString = `SELECT device_token as deviceToken FROM user_device_tokens WHERE user_id = ? AND user_type = ?;`;

  try {
    const result = await query(queryString, [userId, userType]);
    return result;
  } catch (err) {
    logger.error(err, `error being received: [findDeviceTokenForUserId]`);
    throw err;
  }
};

export const deleteDeviceToken = async (deviceToken) => {
  const queryString = `DELETE FROM user_device_tokens WHERE device_token = ?;`;

  try {
    const result = await query(queryString, [deviceToken]);
    return result;
  } catch (err) {
    logger.error(err, `error being received: [findDeviceTokenForUserId]`);
    throw err;
  }
};

export const saveNotificationToDB = async (
  userId,
  title,
  body,
  actionUrl,
  type,
  source
) => {
  const queryString = `
    INSERT INTO user_notifications (user_id, title, body, action_url, type, source)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  try {
    return query(queryString, [userId, title, body, actionUrl, type, source]);
  } catch (err) {
    logger.error(err, `error being received: [saveNotificationToDB]`);
    throw err;
  }
};
