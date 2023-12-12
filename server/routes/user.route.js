import express from "express";
import {
  harperAllUsers,
  harperGetUser,
  harperLoginUser,
  harperRegisterUser,
  harperSetAvatar,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", harperRegisterUser);
router.post("/login", harperLoginUser);
router.post("/setavatar", harperSetAvatar);
router.get("/", harperAllUsers);
router.get("/:id", harperGetUser);

export { router as userRouter };
