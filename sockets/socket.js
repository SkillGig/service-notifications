import logger from "../config/logger";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    logger.debug("New client connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId); // Usually 'user-<userId>'
      logger.debug(`User joined room: ${roomId}`);
    });

    socket.on("disconnect", () => {
      logger.debug("Client disconnected:", socket.id);
    });
  });
};
