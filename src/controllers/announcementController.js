import { generateSlug } from "../helpers/index.js";
import db from "../models/index.js";
import { sortAvailableClasses } from "../constant/index.js";
const { School, Membership, Announcement } = db;

export const fetchSchoolAnnouncement = async (req, res) => {
	try {
		const { slug } = req.params;
		if (!slug) {
			return res.status(400).json({
				success: false,
				message: "Slug is required",
			});
		}
		const school = await School.findOne({ slug }).populate("createdBy");
		if (!school) {
			return res.status(404).json({
				success: false,
				message: "School not found",
			});
		}

		const studentsCount = await Membership.countDocuments({
			schoolId: school._id,
			role: "student",
		});

		const availableClasses = school?.details?.available_classes || [];
		const sortedAvailableClasses = sortAvailableClasses(availableClasses);
		school.details.available_classes = sortedAvailableClasses;

		res.status(200).json({
			success: true,
			message: "School information fetched successfully",
			data: school,
			totalStudents: studentsCount,
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
		const { slug } = req.params;

		if (!slug) {
			return res.status(400).json({
				success: false,
				message: "Slug is required",
			});
		}
		const { payloadForUpdate } = req.body || {};

		if (!payloadForUpdate || Object.keys(payloadForUpdate).length === 0) {
			return res.status(400).json({
				success: false,
				message: "Payload for update is required",
			});
		}

		if (payloadForUpdate.name) {
			const updatedSlug = await generateSlug(payloadForUpdate.name);
			payloadForUpdate.slug = updatedSlug;
		}
		const school = await School.findOneAndUpdate(
			{ slug },
			{ ...payloadForUpdate },
			{ new: true }
		);
		if (!school) {
			return res.status(404).json({
				success: false,
				message: "School not found",
			});
		}
		res.status(200).json({
			success: true,
			message: "School information updated successfully",
			data: school,
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
