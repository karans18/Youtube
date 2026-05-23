import express from "express";
import { updateVideo, uploadVideo } from "../controller/video.controller.js";
import { checkAuth } from "../middlewear/auth.middlewear.js";

const router = express.Router();

router.post("/upload", checkAuth, uploadVideo);
router.post("/upload/:id", checkAuth, updateVideo);

export default router;
