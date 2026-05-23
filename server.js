import express from "express";
import dotenv from "dotenv";
dotenv.config();

import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

import ConnectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";

const app = express();
ConnectDB();

app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/video", videoRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
