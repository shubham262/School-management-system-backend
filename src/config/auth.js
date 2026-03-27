import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { handleMongoDbConnection } from "./index.js";

export const handleBetterAuth = async () => {
	const { db } = await handleMongoDbConnection();
	const auth = betterAuth({
		database: mongodbAdapter(db),
		emailAndPassword: {
			enabled: true,
		},
		baseURL: "http://localhost:5000",
	});

	return auth;
};
