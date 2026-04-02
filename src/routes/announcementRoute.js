import express from "express";
import {
	fetchSchoolAnnouncement,
	createSchoolAnnouncement,
} from "../controllers/announcementController.js";
import { requireAdmin } from "../midddleware/index.js";

const router = express.Router();
router.get("/:slug/fetch-school-announcement", fetchSchoolAnnouncement);
router.post(
	"/:slug/create-school-announcement",
	requireAdmin,
	createSchoolAnnouncement
);
export default router;
