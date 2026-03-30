import { handleBetterAuth } from "../config/auth.js";
import { generateSlug } from "../helpers/index.js";
import db from "../models/index.js";
const { School, Membership } = db;

export const registerController = async (req, res) => {
	try {
		const auth = await handleBetterAuth();

		const { email, password, name } = req.body || {};
		const data = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name,
			},
		});

		const userId = data?.user?.id;
		const slug = await generateSlug("dummy");
		const school = await School.create({
			name: "dummy",
			slug,
			createdBy: userId,
		});
		const memebership = await Membership.create({
			userId,
			schoolId: school._id,
			role: "admin",
		});

		res.status(200).json({
			success: true,
			message: "User registered successfully",
			data,
			slug,
			school,
			memebership,
		});
	} catch (error) {
		console.error("Error in registerController:", error);
	}
};
