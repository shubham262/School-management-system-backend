import express from "express";
import {
	createUserInBulk,
	fetchAllStudents,
	fetchAllTeachers,
	fetchAttendence,
	fetchUserInfo,
	fetchUserInformation,
	loginController,
	registerController,
	registerNew,
	removeUserFromSchool,
	updateUserController,
	updateUserPassword,
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
router.get("/:slug/fetch-all-teachers", requireAdmin, fetchAllTeachers);
router.delete(
	"/:slug/remove-user-from-school/:userId",
	requireAdmin,
	removeUserFromSchool
);

router.put(
	"/:slug/change-password",
	requireAuthenticationCheck,
	updateUserPassword
);

router.get(
	"/:slug/fetchUserInformation",
	requireAuthenticationCheck,
	fetchUserInformation
);

router.get("/fetchUser", fetchUserInfo);
router.post("/register-fresh", registerNew);


router.get(
	"/:slug/student-attendence",
	requireAuthenticationCheck,
	fetchAttendence
);

export default router;
