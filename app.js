import express from "express";
import bodyParse from "body-parser";
import NotificationRoutes from "./api/v1/routes/notifications.routes.js";

const app = express();
const port = 4024;
import { pool } from "./config/db.js";
import logger from "./config/logger.js";

app.use(bodyParse.json({ limit: "50mb" }));
app.use(bodyParse.urlencoded({ extended: false }));

// Set CORS and cache control headers
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

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use("/notifications", NotificationRoutes);

app.use("/", (req, res) => {
  res.json({
    message: "Notifications Service",
  });
});
app.listen(port, () => {
  pool.getConnection((err, connection) => {
    if (err) {
      logger.error("Error connecting the Service-Notifications to DataBase");
      process.exit(1);
    }
    logger.info(
      `Service-Notifications connected to the database and server is up and running on PORT: ${port}`
    );
  });
});
