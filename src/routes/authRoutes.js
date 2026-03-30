import express from "express";
import {
	loginController,
	registerController,
} from "../controllers/authController.js";
const router = express.Router();
router.post("/register", registerController);
router.post("/:slug/sign-in", loginController);
export default router;
