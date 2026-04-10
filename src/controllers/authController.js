import { handleBetterAuth } from "../config/auth.js";
import { generateSlug } from "../helpers/index.js";
import db from "../models/index.js";
const { School, Membership, User } = db;
const auth = await handleBetterAuth();
export const registerController = async (req, res) => {
	try {
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
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred during registration",
			error: error,
		});
	}
};

export const loginController = async (req, res) => {
	try {
		const { slug } = req.params;
		const { email, password } = req.body || {};
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required",
			});
		}

		const school = await School.findOne({ slug });
		if (!school) {
			return res.status(404).json({
				success: false,
				message: `No school found with slug: ${slug}`,
			});
		}

		const data = await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		const membership = await Membership.findOne({
			userId: data?.user?.id,
			schoolId: school._id,
		});
		if (!membership) {
			return res.status(403).json({
				success: false,
				message: `User does not have access to school with slug: ${slug}`,
			});
		}

		res.status(200).json({
			success: true,
			message: `Login successful for slug: ${slug}`,
			data,
			membership,
		});
	} catch (error) {
		console.error("Error in loginController:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred during login",
			error: error,
		});
	}
};

export const updateUserController = async (req, res) => {
	try {
		const user = req.user;
		const { payloadForUpdate } = req.body || {};

		if (!payloadForUpdate) {
			return res.status(400).json({
				success: false,
				message: "payloadForUpdate is required",
			});
		}

		const newUserInformation = await User.findOneAndUpdate(
			{ _id: user.id },
			{ ...payloadForUpdate },
			{ returnDocument: "after" }
		);

		res.status(200).json({
			success: true,
			message: `User updated`,
			user: newUserInformation,
		});
	} catch (error) {
		console.error("Error in loginController:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred during updating user",
			error: error,
		});
	}
};

export const createUserInBulk = async (req, res) => {
	try {
		const school = req.school;

		const { users = [] } = req.body || [];
		if (!users?.length) {
			return res.status(400).json({
				success: false,
				message: "users are required",
			});
		}

		const results = [];
		for (let i = 0; i < users?.length; i++) {
			const { email, name, role, profile = {} } = users?.[i] || {};

			if (!email || !name || !role) {
				continue;
			}

			const data = await auth.api.signUpEmail({
				body: {
					email,
					password: "12345678",
					name,
					changePasswordRequired: true,
				},
			});
			const userId = data?.user?.id;

			const memebership = await Membership.create({
				userId,
				schoolId: school._id,
				role,
				profile,
			});

			results.push({
				user: data,
			});
		}
		return res.status(200).json({
			success: true,
			message: "User added successfully",
			data: results,
		});
	} catch (error) {
		console.error("Error in createUserInBulk:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred during registration",
			error: error,
		});
	}
};
