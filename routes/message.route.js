import express from "express";
import { addMessage, getMessages } from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, addMessage);

router.get("/:id", verifyToken, getMessages);

export default router;
