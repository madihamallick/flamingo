import express from "express";
import {
  harperAllUsers,
  harperGetUser,
  harperLoginUser,
  harperRegisterUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", harperRegisterUser);
router.post("/login", harperLoginUser);
router.get("/", harperAllUsers);
router.get("/:id", harperGetUser);

export { router as userRouter };
