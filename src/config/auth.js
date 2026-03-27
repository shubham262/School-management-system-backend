import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { handleMongoDbConnection } from "./index.js";
import { jwt, bearer } from "better-auth/plugins";
export const handleBetterAuth = async () => {
	const { db } = await handleMongoDbConnection();
	const auth = betterAuth({
		database: mongodbAdapter(db),
		emailAndPassword: {
			enabled: true,
		},
		user: {
			additionalFields: {
				role: {
					type: ["user", "admin"],
					required: false,
					defaultValue: "user",
					input: false, // don't allow user to set role
				},
			},
		},
		plugins: [jwt(), bearer()],

		baseURL: "http://localhost:3001",
	});

	return auth;
};
