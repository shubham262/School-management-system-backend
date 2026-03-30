import express from "express";
import {
	fetchSchoolInformationController,
	updateSchoolInformationController,
} from "../controllers/schoolController.js";
const router = express.Router();

router.get("/:slug/school-information", fetchSchoolInformationController);
router.put(
	"/:slug/update-school-information",
	updateSchoolInformationController
);
export default router;
