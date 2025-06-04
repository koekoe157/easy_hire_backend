import { Router } from "express";
import testRouter from "./testRouter.js";

const mainRouter = Router();

mainRouter.use("/test", testRouter);

export default mainRouter;