import { Router } from "express";
import testRouter from "./testRouter.js";
import userRouter from "./userRouter.js"; 
import jobRouter from "./jobRouter.js";

const mainRouter = Router();

mainRouter.use("/test", testRouter);
mainRouter.use("/users", userRouter); 
mainRouter.use("/jobs", jobRouter);

export default mainRouter;
