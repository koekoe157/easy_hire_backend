import { Router } from "express";
import { db } from "../firebase.js";

const userRouter = Router();

userRouter.post("/", async (req, res) => {
  try {
    const { id, name, email, photoUrl, aboutMe } = req.body;

    if (!id || !email) {
      return res.status(400).json({ message: "Missing required fields: id and email" });
    }

    await db.collection("users").doc(id).set(
      {
        name,
        email,
        photoUrl,
        aboutMe,
      },
      { merge: true }
    );

    console.log(`User ${id} created/updated`);
    res.status(201).json({ message: "User saved to Firestore" });
  } catch (error) {
    console.error("POST /users error:", error);
    res.status(500).json({ message: "Failed to save user", error: error.message });
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const doc = await db.collection("users").doc(userId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("GET /users/:id error:", error);
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, photoUrl, aboutMe } = req.body;

    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    await userRef.set(
      {
        name,
        email,
        photoUrl,
        aboutMe,
      },
      { merge: true }
    );

    console.log(`User ${userId} updated`);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("PUT /users/:id error:", error);
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
});

export default userRouter;
