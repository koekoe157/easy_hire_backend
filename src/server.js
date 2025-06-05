import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mainRouter from "./routes/mainRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json()); // ✅ enables JSON request body parsing
app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
