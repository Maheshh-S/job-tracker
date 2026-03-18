import express from "express";
import { updateApplicationStatus } from "../controllers/applicationController";


import {
  createApplication,
  getApplications,
} from "../controllers/applicationController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createApplication);
router.get("/", protect, getApplications);

router.put("/:id/status", protect, updateApplicationStatus);


export default router;