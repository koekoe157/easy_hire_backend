import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mainRouter from "./routes/mainRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", mainRouter);

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at ${HOST}:${PORT}`);
});
