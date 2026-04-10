import express from "express";
import {
	fetchSchoolAnnouncement,
	createSchoolAnnouncement,
	deleteSchoolAnnouncement,
	updateAnnouncement,
} from "../controllers/announcementController.js";
import { requireAdmin } from "../midddleware/index.js";

const router = express.Router();
router.get("/:slug/fetch-school-announcement", fetchSchoolAnnouncement);
router.post(
	"/:slug/create-school-announcement",
	requireAdmin,
	createSchoolAnnouncement
);
router.delete(
	"/:slug/deleteAnnouncement/:annoucementId",
	requireAdmin,
	deleteSchoolAnnouncement
);

router.put(
	"/:slug/update-announcement/:annoucementId",
	requireAdmin,
	updateAnnouncement
);
export default router;
