import mongoose from "mongoose";
const { Schema } = mongoose;

const announcementSchema = new Schema(
	{
		schoolId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "School",
		},

		tag: {
			type: String,
			required: true,
			trim: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},

		createdBy: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},

		scope: {
			type: String,
			enum: ["school", "class"],
			required: true,
		},
		classes: [
			{
				type: String,
			},
		],

		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
	},
	{ timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
