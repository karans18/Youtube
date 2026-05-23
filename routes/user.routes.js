import express from "express";
import { login, signup } from "../controller/user.controlle.js";
// import multer from "multer";
// import fs from "fs";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
