import { Router } from "express";
import testRouter from "./testRouter.js";
import userRouter from "./userRouter.js";
import jobRouter from "./jobRouter.js";
import applyRouter from "./applyRouter.js"; // Assuming applyRouter is defined elsewhere

const mainRouter = Router();

mainRouter.use("/test", testRouter);
mainRouter.use("/users", userRouter);
mainRouter.use("/jobs", jobRouter);
mainRouter.use("/apply", applyRouter); // Assuming applyRouter is defined elsewhere

export default mainRouter;
