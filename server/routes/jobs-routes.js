// import express from "express";
// import { addJob, getJobs, downloadResume,updateJobStatus } from "../controllers/job-controller.js";
// import upload from "../middlewares/upload.js";
// import { authenticate } from "../services/auth-middleware.js";
// const router = express.Router();
// router.post("/add-job", authenticate, upload.single("resume"), addJob);
// router.get("/get-job", authenticate, getJobs);
// router.get("/download/:fileName", downloadResume);
// router.put("/update-job-status", authenticate, updateJobStatus);
// export default router;

import express from "express";
import { addJob, getJobs, updateJobStatus } from "../controllers/job-controller.js";
import { authenticate } from "../services/auth-middleware.js";

const router = express.Router();

router.post("/add-job", authenticate, addJob);
router.get("/get-job", authenticate, getJobs);
router.put("/update-job-status", authenticate, updateJobStatus);

export default router;
