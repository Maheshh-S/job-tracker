import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    userId: (req as any).userId,
  });
});

export default router;