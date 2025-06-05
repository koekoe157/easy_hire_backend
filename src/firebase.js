// src/firebase.js
import admin from "firebase-admin";
import { readFileSync } from "fs";

// Read the service account key
const serviceAccount = JSON.parse(
readFileSync("keys/g1-easy-hire-582763b2c2de.json", "utf8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };
