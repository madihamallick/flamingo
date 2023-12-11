import express from "express";
import {
  harperAllUsers,
  harperGetUser,
  harperGetUserMessage,
  harperLoginUser,
  harperRegisterUser,
  harperUserMessage,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", harperRegisterUser);
router.post("/login", harperLoginUser);
router.get("/", harperAllUsers);
router.get("/:id", harperGetUser);
router.post("/messages", harperUserMessage);
router.get("/messages/:id", harperGetUserMessage);

export { router as userRouter };
