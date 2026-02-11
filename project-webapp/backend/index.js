import "./configs/env.js";

import express from "express";
import connectDB from "./configs/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import productRoutes from "./routes/product.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
}))

app.use("/api/auth", authRoutes);
app.use("/file", fileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

connectDB();

app.get("/", (_, res) => {
  res.send("EchoFin backend running");
});

app.listen(8000, () => {
  console.log("Server running on port", 8000);
});