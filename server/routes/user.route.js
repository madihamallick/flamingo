import express from "express";
import { harperRegisterUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", harperRegisterUser);

export { router as userRouter };
