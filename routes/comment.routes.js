import express from "express";
import { checkAuth } from "../middlewear/auth.middlewear";
const router = express.Router();

router.post("/new", checkAuth, newComment);
router.delete("/commentId", checkAuth, newComment);
router.post("/:commentId", checkAuth, newComment);
router.get("/comment/:videoId", checkAuth, newComment);

export default router;
