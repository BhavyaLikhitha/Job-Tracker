import express from "express";
import { addJob, getJobs, updateJobStatus, searchJobs, deleteJob, updateJob } from "../controllers/job-controller.js";
import { authenticate } from "../services/auth-middleware.js";

const router = express.Router();

router.post("/add-job", authenticate, addJob);
router.get("/get-job", authenticate, getJobs);
router.get("/search-job", authenticate, searchJobs);
router.put("/update-job-status", authenticate, updateJobStatus);
router.put("/update-job/:id", authenticate, updateJob);
router.delete("/delete-job/:id", authenticate, deleteJob);

export default router;
