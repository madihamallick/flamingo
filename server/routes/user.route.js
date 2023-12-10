import express from "express";
import {
  harperAllUsers,
  harperGetUser,
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

export { router as userRouter };
