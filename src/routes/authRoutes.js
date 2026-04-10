import express from "express";
import {
	createUserInBulk,
	loginController,
	registerController,
	updateUserController,
} from "../controllers/authController.js";
import {
	requireAdmin,
	requireAuthenticationCheck,
} from "../midddleware/index.js";
const router = express.Router();
router.post("/register", registerController);
router.post("/:slug/sign-in", loginController);
router.put(
	"/:slug/updateUserInformation",
	requireAuthenticationCheck,
	updateUserController
);
router.post("/:slug/add-bulk-user", requireAdmin, createUserInBulk);

export default router;
