import express from "express";
import {
  addConversation,
  getConversation,
  getConversations,
  updateConversation,
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/single/:id", verifyToken, getConversation);
router.get("/", verifyToken, getConversations);
router.post("/", verifyToken, addConversation);
router.put("/:id", verifyToken, updateConversation);

export default router;
