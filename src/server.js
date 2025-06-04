import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsConfig } from "./config/cors-config.js";
import mainRouter from "./routes/mainRouter.js";

const app = express();
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3000;

app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
