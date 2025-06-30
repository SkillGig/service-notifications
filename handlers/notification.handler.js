import { saveNotificationToDB } from "../api/v1/services/notifications.query.js";
import { io } from "../app.js";

export const handleNotificationEvent = async (payload) => {
  const {
    userId,
    roadmapCourseId,
    moduleWeek,
    sectionId,
    contentRefId,
    title,
    body,
    actionUrl,
    type,
    source,
  } = payload;

  await saveNotificationToDB({
    userId,
    roadmapCourseId,
    moduleWeek,
    sectionId,
    contentRefId,
    title,
    body,
    actionUrl,
    type,
    source,
  });

  return io.to(`user-${userId}`).emit("new-notification", {
    title,
    roadmapCourseId,
    sectionId,
    moduleWeek,
    contentRefId,
    body,
    type,
    actionUrl,
  });
};
