import { generateSlug } from "../helpers/index.js";
import db from "../models/index.js";
import { sortAvailableClasses } from "../constant/index.js";
const { School, Membership, Announcement } = db;

export const fetchSchoolAnnouncement = async (req, res) => {
	try {
		const { slug } = req.params;
		const { all = false } = req.query;

		if (!slug) {
			return res.status(400).json({
				success: false,
				message: "Slug is required",
			});
		}
		const school = await School.findOne({ slug });
		if (!school) {
			return res.status(404).json({
				success: false,
				message: "School not found",
			});
		}

		let scope = all === "true" ? {} : { scope: "school" };

		const schoolAnnoucements = await Announcement.find({
			schoolId: school?._id,
			status: "active",
			...scope,
		}).sort({ createdAt: -1 });

		res.status(200).json({
			message: "Announcements fetched successfully",
			schoolAnnoucements,
		});
	} catch (error) {
		console.error("Error in fetchSchoolAnnouncement:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred while fetching school announement",
			error: error,
		});
	}
};

export const createSchoolAnnouncement = async (req, res) => {
	try {
		const user = req.user;

		const school = req.school;

		const {
			tag,
			title,
			description,
			scope = "school",
			classes = [],
		} = req?.body || {};

		if (!tag || !title || !description) {
			return res.status(400).json({
				success: false,
				message: "Tag, title and description are required",
			});
		}

		let classPayload = classes?.length ? { classes } : {};

		const announcement = await Announcement.create({
			schoolId: school._id,
			tag,
			title,
			description,
			scope,
			createdBy: user.id,
			...classPayload,
		});

		return res.status(201).json({
			success: true,
			message: "Announcement created successfully",
			data: announcement,
		});
	} catch (error) {
		console.error("Error in createAnnouncement:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred while creating announcement",
			error: error,
		});
	}
};

export const deleteSchoolAnnouncement = async (req, res) => {
	try {
		const { annoucementId } = req.params;

		if (!annoucementId) {
			return res.status(400).json({
				success: false,
				message: "AnnoucementId was required",
			});
		}

		const announcement = await Announcement.findOneAndDelete({
			_id: annoucementId,
		});
		if (!announcement) {
			return res.status(400).json({
				success: false,
				message: "Annoucement with provided id was not found",
			});
		}
		return res.status(201).json({
			success: true,
			message: "Announcement deleted successfully",
			data: announcement,
		});
	} catch (error) {
		console.error("Error in deleteSchoolAnnouncement:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred while deleting announement",
			error: error,
		});
	}
};

export const updateAnnouncement = async (req, res) => {
	try {
		const { annoucementId } = req.params;

		const { payloadForUpdate } = req.body || {};

		if (!payloadForUpdate) {
			return res.status(400).json({
				success: false,
				message: "payloadForUpdate is required",
			});
		}

		const announcement = await Announcement.findOneAndUpdate(
			{ _id: annoucementId },
			{ ...payloadForUpdate },
			{ returnDocument: "after" }
		);

		if (!announcement) {
			return res.status(400).json({
				success: false,
				message: "Annoucement with provided id was not found",
			});
		}

		return res.status(201).json({
			success: true,
			message: "Announcement updated successfully",
			data: announcement,
		});
	} catch (error) {
		console.error("Error in updateAnnouncement:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred while updating announcement",
			error: error,
		});
	}
};
