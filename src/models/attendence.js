import mongoose from "mongoose";
const { Schema } = mongoose;

const attendeceSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		schoolId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "School",
		},
		status: {
			type: String,
			enum: ["present", "absent", "not-marked", "late"],
			default: "not-marked",
		},
		date: {
			type: Date,
			required: true,
		},
		metadata: {
			type: Schema.Types.Mixed,
			required: false,
			default: {},
		},
		markedBy: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{ timestamps: true }
);

const Attendence = mongoose.model("Attendence", attendeceSchema);

export default Attendence;
