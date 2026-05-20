import dotenv, { config } from "dotenv";
import express from "express";
dotenv.config();

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
connectDB();

app.use("/api/v1/user", userRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
