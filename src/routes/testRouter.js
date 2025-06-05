import { Router } from "express";

const userRouter = Router();
const userDataStore = {};

// ✅ POST /api/v1/users
userRouter.post("/", (req, res) => {
  const { id, name, email, photoUrl, aboutMe } = req.body;

  if (!id || !email) {
    return res.status(400).json({ message: "Missing required fields: id and email" });
  }

  userDataStore[id] = { name, email, photoUrl, aboutMe };

  res.status(201).json({
    message: "User created",
    user: userDataStore[id],
  });
});

export default userRouter;
