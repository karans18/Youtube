import express from "express";
import {
  deleteVideo,
  disLike,
  getAllVideos,
  getMyVideos,
  getVideoByCategory,
  getVideoById,
  like,
  tag,
  updateVideo,
  uploadVideo,
} from "../controller/video.controller.js";
import { checkAuth } from "../middlewear/auth.middlewear.js";
import { getRounds } from "bcrypt";

const router = express.Router();

router.post("/upload", checkAuth, uploadVideo);
router.put("/update/:id", checkAuth, updateVideo);

router.delete("/delete/:id", checkAuth, deleteVideo);
router.get("/all", checkAuth, getAllVideos);
router.get("/my-videos", checkAuth, getMyVideos);
router.get("/:id", checkAuth, getVideoById);
router.get("/category/:category", checkAuth, getVideoByCategory);
router.get("/tag/:tag", checkAuth, tag);
router.get("/like", checkAuth, like);
router.get("/disike", checkAuth, disLike);

export default router;
