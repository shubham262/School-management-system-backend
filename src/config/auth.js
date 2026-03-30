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
				profile: {
					type: "object",
					required: false,
					defaultValue: {},
				},
				changePasswordRequired: {
					type: "boolean",
					defaultValue: false,
				},
			},
		},
		plugins: [jwt(), bearer()],

		baseURL: "http://localhost:3001",
	});

	return auth;
};
