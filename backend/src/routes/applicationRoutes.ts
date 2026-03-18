import express from "express";
import {
  createApplication,
  getApplications,
} from "../controllers/applicationController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createApplication);
router.get("/", protect, getApplications);

export default router;