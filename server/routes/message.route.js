import express from "express";
import {
  harperGetUserMessage,
  harperUserMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", harperUserMessage);
router.get("/:id", harperGetUserMessage);

export { router as messageRouter };
