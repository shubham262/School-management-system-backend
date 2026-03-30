import mongoose from "mongoose";
const { Schema } = mongoose;

const schoolSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},

		details: {
			type: Schema.Types.Mixed,
			required: false,
			default: {},
			//email,phone,address,logo,website,available_classes
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
	},
	{ timestamps: true }
);

const School = mongoose.model("School", schoolSchema);

export default School;
