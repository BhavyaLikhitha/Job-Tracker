import express from "express";
import { addJob, getJobs, downloadResume } from "../controllers/job-controller.js";
import upload from "../middlewares/upload.js";
import { authenticate } from "../services/auth-middleware.js";

const router = express.Router();

router.post("/add-job", authenticate, upload.single("resume"), addJob);
router.get("/jobs", authenticate, getJobs);
router.get("/download/:fileName", downloadResume);

export default router;
