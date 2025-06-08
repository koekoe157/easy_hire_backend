import { Router } from "express";
import { db } from "../firebase.js";

const applyRouter = Router();

// ✅ Submit a job application
applyRouter.post("/", async (req, res) => {
  try {
    const {
      jobId,
      applicantId,
      applicantName,
      applicantEmail,
      education,
      otherRequests,
      jobTitle,
      companyName,
      salary,
      companyPhotoUrl,
      tags,
    } = req.body;

    if (
      !jobId ||
      !applicantId ||
      !applicantName ||
      !applicantEmail ||
      !education
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already applied for this job
    const existingApplication = await db
      .collection("applications")
      .where("jobId", "==", jobId)
      .where("applicantId", "==", applicantId)
      .get();

    if (!existingApplication.empty) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const applicationData = {
      jobId,
      applicantId,
      applicantName,
      applicantEmail,
      education,
      otherRequests: otherRequests || null,
      status: "pending",
      appliedAt: new Date().toISOString(),
      jobTitle: jobTitle || "",
      companyName: companyName || "",
      salary: salary || "",
      companyPhotoUrl: companyPhotoUrl || null,
      tags: tags || [],
    };

    const newDocRef = db.collection("applications").doc();
    await newDocRef.set(applicationData);

    res.status(201).json({
      message: "Application submitted successfully",
      id: newDocRef.id,
    });
  } catch (error) {
    console.error("POST /apply error:", error);
    res.status(500).json({
      message: "Failed to submit application",
      error: error.message,
    });
  }
});

// ✅ Get all applications for a specific user
applyRouter.get("/user/:userId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("applications")
      .where("applicantId", "==", req.params.userId)
      .get();

    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(applications);
  } catch (error) {
    console.error("GET /apply/user/:userId error:", error);
    res.status(500).json({
      message: "Failed to fetch user applications",
      error: error.message,
    });
  }
});

// ✅ Get all applications for a specific job (for employers)
applyRouter.get("/job/:jobId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("applications")
      .where("jobId", "==", req.params.jobId)
      .orderBy("appliedAt", "desc")
      .get();

    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(applications);
  } catch (error) {
    console.error("GET /apply/job/:jobId error:", error);
    res.status(500).json({
      message: "Failed to fetch job applications",
      error: error.message,
    });
  }
});

// ✅ Update application status (for employers)
applyRouter.patch("/:applicationId/status", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.collection("applications").doc(applicationId).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res
      .status(200)
      .json({ message: "Application status updated successfully" });
  } catch (error) {
    console.error("PATCH /apply/:applicationId/status error:", error);
    res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
});

export default applyRouter;
