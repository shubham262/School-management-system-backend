export const registerController = async (req, res) => {
	try {
		res.status(200).json({
			success: true,
			message: "User registered successfully",
		});
	} catch (error) {}
};
