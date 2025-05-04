import admin from "firebase-admin";
import { readFileToNconf } from "../config/index.js";
const nconf = readFileToNconf();

admin.initializeApp({
  credential: admin.credential.cert(
    nconf.get("firebaseNotificationServiceConfig")
  ),
});

export default admin;
