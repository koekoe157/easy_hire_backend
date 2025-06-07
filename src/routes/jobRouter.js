import { Router } from "express";
import { db } from "../firebase.js";

const jobRouter = Router();

// ✅ Get all jobs or filter by createdBy
jobRouter.get("/", async (req, res) => {
  try {
    const { createdBy } = req.query;
    let query = db.collection("jobs");

    if (createdBy) {
      query = query.where("createdBy", "==", createdBy);
    }

    const snapshot = await query.get();
    const jobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET /jobs error:", error);
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
});

// ✅ Get a single job by ID
jobRouter.get("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const doc = await db.collection("jobs").doc(jobId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("GET /jobs/:id error:", error);
    res.status(500).json({
      message: "Failed to fetch job",
      error: error.message,
    });
  }
});

// ✅ Create a new job
jobRouter.post("/", async (req, res) => {
  try {
    const {
      role,
      company,
      salary,
      location,
      jobType,
      workMode,
      education,
      workingDays,
      workingHours,
      category,
      requirements,
      responsibilities,
      jobSummary,
      createdBy,
      createdByName,
      createdByPhotoUrl,
      tag,
      imageUrl,
    } = req.body;

    if (!role || !company || !salary || !location || !createdBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const jobData = {
      role,
      company,
      salary,
      location,
      jobType: jobType || '',
      workMode: workMode || '',
      education: education || '',
      workingDays: workingDays || '',
      workingHours: workingHours || '',
      category: category || '',
      requirements: requirements || '',
      responsibilities: responsibilities || '',
      jobSummary: jobSummary || '',
      createdBy,
      createdByName: createdByName || '',
      createdByPhotoUrl: createdByPhotoUrl || '',
      tag: tag || '',
      imageUrl: imageUrl || '',
      createdAt: new Date().toISOString(),
    };

    const newDocRef = db.collection("jobs").doc();
    await newDocRef.set(jobData);

    res.status(201).json({ message: "Job created", id: newDocRef.id });
  } catch (error) {
    console.error("POST /jobs error:", error);
    res.status(500).json({
      message: "Failed to save job",
      error: error.message,
    });
  }
});

// ✅ Get all jobs created by a specific user
jobRouter.get("/by-user/:userId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("jobs")
      .where("createdBy", "==", req.params.userId)
      .get();

    const jobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET /jobs/by-user/:userId error:", error);
    res.status(500).json({
      message: "Failed to fetch user's jobs",
      error: error.message,
    });
  }
});

export default jobRouter;