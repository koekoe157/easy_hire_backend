// upload/upload_job.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Load service account key
const serviceAccountPath = path.resolve("keys/g1-easy-hire-582763b2c2de.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const bulkFilePath = path.resolve("create/job_template.json");
const jobList = JSON.parse(fs.readFileSync(bulkFilePath, "utf8"));

async function getStartingJobId() {
  const snapshot = await db
    .collection("jobs")
    .orderBy(admin.firestore.FieldPath.documentId())
    .get();

  let lastId = 0;
  if (!snapshot.empty) {
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const lastDocId = parseInt(lastDoc.id, 10);
    if (!isNaN(lastDocId)) lastId = lastDocId;
  }

  return lastId + 1;
}

async function uploadJobsInBulk() {
  try {
    const startId = await getStartingJobId();

    for (let i = 0; i < jobList.length; i++) {
      const jobId = String(startId + i).padStart(3, "0");
      await db.collection("jobs").doc(jobId).set(jobList[i]);
      console.log(`✅ Uploaded job ${jobId}`);
    }

    console.log("🎉 All jobs uploaded successfully.");
  } catch (error) {
    console.error("❌ Bulk upload failed:", error);
  }
}

uploadJobsInBulk();
