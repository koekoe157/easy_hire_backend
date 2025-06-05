import { Router } from "express";
import { db } from "../firebase.js";

const jobRouter = Router();

// ✅ Get all jobs
jobRouter.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("jobs").get();

    const jobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET /jobs error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch jobs", error: error.message });
  }
});

// ✅ Get single job by ID
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
    res
      .status(500)
      .json({ message: "Failed to fetch job", error: error.message });
  }
});

// ✅ Create or update (upsert) a job
jobRouter.post("/", async (req, res) => {
  try {
    const {
      id, // e.g. "002"
      role,
      company,
      salary,
      location,
      tags,
      requirements,
      responsibilities,
      jobSummary,
    } = req.body;

    if (!id || !role || !company || !salary || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await db.collection("jobs").doc(id).set(
      {
        role,
        company,
        salary,
        location,
        tags,
        requirements,
        responsibilities,
        jobSummary,
      },
      { merge: true }
    );

    res.status(201).json({ message: `Job ${id} saved` });
  } catch (error) {
    console.error("POST /jobs error:", error);
    res
      .status(500)
      .json({ message: "Failed to save job", error: error.message });
  }
});

export default jobRouter;
