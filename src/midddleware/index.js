import { handleBetterAuth } from "../config/auth.js";
import db from "../models/index.js";
const { School, Membership } = db;

export const requireAdmin = async (req, res, next) => {
	const auth = await handleBetterAuth();
	try {
		const authHeader = req.headers?.authorization || req.headers?.Authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Authorization header missing or malformed",
			});
		}

		const session = await auth.api.getSession({
			headers: new Headers({ authorization: authHeader }),
		});
		if (!session || !session.user) {
			return res.status(401).json({
				success: false,
				message: "Invalid session or user not found",
			});
		}

		const userId = session.user.id;
		const { slug } = req.params;
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

		const membership = await Membership.findOne({
			userId,
			schoolId: school._id,
			role: "admin",
		});

		if (!membership) {
			return res.status(403).json({
				success: false,
				message: "User does not have admin privileges for this school",
			});
		}

		req.user = session.user;
		req.school = school;
		req.membership = membership;
		next();
	} catch (error) {
		console.error("Error in requireAdmin middleware:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred while checking admin privileges",
			error: error,
		});
	}
};

export const requireAuthenticationCheck = async (req, res, next) => {
	const auth = await handleBetterAuth();
	try {
		const authHeader = req.headers?.authorization || req.headers?.Authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Authorization header missing or malformed",
			});
		}

		const session = await auth.api.getSession({
			headers: new Headers({ authorization: authHeader }),
		});
		if (!session || !session.user) {
			return res.status(401).json({
				success: false,
				message: "Invalid session or user not found",
			});
		}

		const userId = session.user.id;
		const { slug } = req.params;
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

		const membership = await Membership.findOne({
			userId,
			schoolId: school._id,
		});

		if (!membership) {
			return res.status(403).json({
				success: false,
				message: "User does not have admin privileges for this school",
			});
		}

		req.user = session.user;
		req.school = school;
		req.membership = membership;
		next();
	} catch (error) {
		console.error("Error in requireAuthenticationCheck middleware:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred while checking requireAuthenticationCheck ",
			error: error,
		});
	}
};
