import express from "express";
import {
	loginController,
	registerController,
	updateUserController,
} from "../controllers/authController.js";
import { requireAuthenticationCheck } from "../midddleware/index.js";
const router = express.Router();
router.post("/register", registerController);
router.post("/:slug/sign-in", loginController);
router.put(
	"/:slug/updateUserInformation",
	requireAuthenticationCheck,
	updateUserController
);
export default router;
