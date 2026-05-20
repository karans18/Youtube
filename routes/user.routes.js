import express from "express";
import { signup } from "../controller/user.controlle.js";
// import multer from "multer";
// import fs from "fs";

const router = express.Router();
// const uploadDir = "uploads";

// fs.mkdirSync(uploadDir, { recursive: true });

// // Configure multer — use diskStorage or memoryStorage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });

// const upload = multer({ storage });

// const uploadLogo = (req, res, next) => {
//   upload.single("logo")(req, res, (err) => {
//     if (!err) return next();

//     return res.status(400).json({
//       message:
//         "Invalid multipart form data. Send the logo field as a file using form-data and let your client set Content-Type automatically.",
//       error: err.message,
//     });
//   });
// };

router.post("/signup", signup);

export default router;
