import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
		},
		emailVerified: {
			type: Boolean,
			required: false,
			default: false,
		},
		profile: {
			type: Schema.Types.Mixed,
			default: {},
			required: false,
		},
		changePasswordRequired: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema, "user");

export default User;
