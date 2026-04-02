import express from "express";
import {
	fetchSchoolAnnouncement,
	createSchoolAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();
router.get("/:slug/fetch-school-announcement", fetchSchoolAnnouncement);
router.post("/:slug/create-school-announcement", createSchoolAnnouncement);
export default router;
