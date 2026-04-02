import express from "express";
import {
	fetchSchoolInformationController,
	updateSchoolInformationController,
} from "../controllers/schoolController.js";
import { requireAdmin } from "../midddleware/index.js";
const router = express.Router();

router.get("/:slug/school-information", fetchSchoolInformationController);
router.put(
	"/:slug/update-school-information",
	requireAdmin,
	updateSchoolInformationController
);
export default router;
