import express from "express";
import {
  getReviews,
  addReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/:id", verifyToken, addReview);
router.get("/:gigId", getReviews);
router.delete("/:gigId", deleteReview);

export default router;
