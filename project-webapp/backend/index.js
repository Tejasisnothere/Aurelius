import "./configs/env.js";

import express from "express";
import connectDB from "./configs/db.js";
import fileRoutes from "./routes/file.routes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
}))

app.use("/file", fileRoutes);

connectDB();

app.get("/", (_, res) => {
  res.send("EchoFin backend running");
});

app.listen(8000, () => {
  console.log("Server running on port", 8000);
});
