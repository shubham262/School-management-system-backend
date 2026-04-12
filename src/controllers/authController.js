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

		const results = users?.map(async (user) => {
			const { email, name, role, profile = {} } = user || {};

			if (!email || !name || !role) {
				return { success: false, reason: "Email ,name and role is required" };
			}

			try {
				const data = await auth.api.signUpEmail({
					body: {
						email,
						password: "12345678",
						name,
						changePasswordRequired: true,
					},
				});
			} catch (error) {
				return {
					success: false,
					reason: "user may already exisit with the provided email id",
				};
			}

			const userId = data?.user?.id;

			const memebership = await Membership.create({
				userId,
				schoolId: school._id,
				role,
				profile,
			});
			//make an api call to that email sending microservice

			return {
				success: true,
				message: "User added SuccessFully",
				data: {
					user: data?.user,
					memebership,
				},
			};
		});

		const response = await Promise.all(results);

		return res.status(200).json({
			success: true,
			message: "User added successfully",
			data: response,
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

export const fetchAllStudents = async (req, res) => {
	try {
		const school = req.school;
		let {
			page = 1,
			limit = 10,
			query = "",
			studentClass = "",
		} = req.query || {};

		page = parseInt(page);
		limit = parseInt(limit);
		studentClass = studentClass ? JSON.parse(studentClass) : [];
		const skip = (page - 1) * limit;

		const filter = {
			schoolId: school?._id,
			role: "student",
		};

		if (studentClass?.length) {
			filter["profile.class"] = { $in: studentClass };
		}

		const pipeline = [
			{
				$match: filter,
			},
			{
				$lookup: {
					from: "user",
					localField: "userId",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$unwind: "$user",
			},
			...(query
				? [
						{
							$match: {
								$or: [
									{
										"user.email": {
											$regex: query,
											$options: "i",
										},
									},
									{
										"user.name": {
											$regex: query,
											$options: "i",
										},
									},
								],
							},
						},
				  ]
				: []),

			{
				$project: {
					name: "$user.name",
					email: "$user.email",
					userId: "$user._id",
					className: "$profile.class",
				},
			},
			{
				$sort: { createdAt: -1 },
			},
			{
				$facet: {
					data: [{ $skip: skip }, { $limit: limit }],
					totalDocument: [{ $count: "count" }],
				},
			},
		];

		const results = await Membership.aggregate(pipeline);
		const students = results?.[0]?.data;
		const total = results?.[0]?.totalDocument;

		return res.status(200).json({
			success: true,
			message: "User added successfully",
			data: { students, total },
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

export const fetchAllTeachers = async (req, res) => {
	try {
		const school = req.school;
		let {
			page = 1,
			limit = 10,
			query = "",
			classFilter = "",
			subjectsFilter = "",
		} = req.query || {};

		page = parseInt(page);
		limit = parseInt(limit);
		classFilter = classFilter ? JSON.parse(classFilter) : [];
		subjectsFilter = subjectsFilter ? JSON.parse(subjectsFilter) : [];
		const skip = (page - 1) * limit;

		const filter = {
			schoolId: school?._id,
			role: "teacher",
		};

		if (classFilter?.length) {
			filter["profile.classes"] = { $in: classFilter };
		}

		if (subjectsFilter?.length) {
			filter["profile.subjects"] = { $in: subjectsFilter };
		}

		const pipeline = [
			{
				$match: filter,
			},
			{
				$lookup: {
					from: "user",
					localField: "userId",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$unwind: "$user",
			},
			...(query
				? [
						{
							$match: {
								$or: [
									{
										"user.email": {
											$regex: query,
											$options: "i",
										},
									},
									{
										"user.name": {
											$regex: query,
											$options: "i",
										},
									},
								],
							},
						},
				  ]
				: []),

			{
				$project: {
					name: "$user.name",
					email: "$user.email",
					userId: "$user._id",
					classes: "$profile.classes",
					subjects: "$profile.subjects",
				},
			},
			{
				$sort: { createdAt: -1 },
			},
			{
				$facet: {
					data: [{ $skip: skip }, { $limit: limit }],
					totalDocument: [{ $count: "count" }],
				},
			},
		];

		const results = await Membership.aggregate(pipeline);
		const teachers = results?.[0]?.data;
		const total = results?.[0]?.totalDocument;

		return res.status(200).json({
			success: true,
			message: "User added successfully",
			data: { teachers, total },
		});
	} catch (error) {
		console.error("Error in fetchAllTeachers:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred during fetchAllTeachers",
			error: error,
		});
	}
};

export const removeUserFromSchool = async (req, res) => {
	try {
		const school = req.school;
		const { userId } = req.params;
		if (!userId) {
			return res.status(400).json({
				success: false,
				message: "UserId required",
			});
		}

		const membership = await Membership.findOneAndDelete({
			schoolId: school?._id,
			userId: userId,
		});

		if (!membership) {
			return res.status(400).json({
				success: false,
				message: "Could not find any user with the given id",
			});
		}

		return res.status(200).json({
			success: true,
			message: "User deleted from the school  successfully",
			data: membership,
		});
	} catch (error) {
		console.error("Error in removeUserFromSchool:", error);
		res.status(error?.statusCode || 500).json({
			success: false,
			message: "An error occurred during removeUserFromSchool",
			error: error,
		});
	}
};
