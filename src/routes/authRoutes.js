import express from "express";
import {
	createUserInBulk,
	fetchAllStudents,
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
router.get("/:slug/fetch-all-students", requireAdmin, fetchAllStudents);

export default router;
