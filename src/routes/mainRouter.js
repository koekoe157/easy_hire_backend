import { Router } from "express";
import testRouter from "./testRouter.js";
import userRouter from "./userRouter.js"; // ✅ Add this

const mainRouter = Router();

mainRouter.use("/test", testRouter);
mainRouter.use("/users", userRouter); // ✅ Add this

export default mainRouter;
