import express from "express";
import {
  addGig,
  deleteGig,
  getGig,
  getGigs,
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", getGigs);
router.get("/single/:id", getGig);
router.post("/", verifyToken, addGig);
router.delete("/:id", verifyToken, deleteGig);

export default router;
