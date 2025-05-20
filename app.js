import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParse from "body-parser";
import NotificationRoutes from "./api/v1/routes/notifications.routes.js";
import { pool } from "./config/db.js";
import logger from "./config/logger.js";
import { startKafkaConsumer } from "./kafka/consumer.js";

const app = express();
const port = 4024;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  logger.debug(`New client connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    logger.debug(`Joined room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    logger.debug(`Client disconnected: ${socket.id}`);
  });
});

app.use(bodyParse.json({ limit: "50mb" }));
app.use(bodyParse.urlencoded({ extended: false }));

// CORS and cache headers
app.use((req, res, next) => {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Expose-Headers", "Authorization");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, device-token, platform, user-type"
  );

  // Cache control headers
  res.header("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.header("Expires", "0");
  res.header("Pragma", "no-cache");

  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

app.use("/notifications", NotificationRoutes);

app.use("/", (req, res) => {
  res.json({ message: "Notifications Service" });
});

server.listen(port, () => {
  pool.getConnection((err) => {
    if (err) {
      logger.error("Error connecting Service-Notifications to database");
      process.exit(1);
    }
    logger.info(
      `Service-Notifications connected to the database and server is up and running on PORT: ${port}`
    );
    startKafkaConsumer()
      .then(() => logger.info("✅ Kafka consumer started successfully"))
      .catch((err) => logger.error("❌ Failed to start Kafka consumer", err));
  });
});
