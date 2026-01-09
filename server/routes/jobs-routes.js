import express from "express";
import { addJob, getJobs, updateJobStatus,searchJobs } from "../controllers/job-controller.js";
import { authenticate } from "../services/auth-middleware.js";

const router = express.Router();

router.post("/add-job", authenticate, addJob);
router.get("/get-job", authenticate, getJobs);
router.get("/search-job", authenticate, searchJobs);
router.put("/update-job-status", authenticate, updateJobStatus);

export default router;
