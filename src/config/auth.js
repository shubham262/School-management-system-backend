import dotenv from "dotenv";
dotenv.config();
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { handleMongoDbConnection } from "./index.js";
import { jwt, bearer } from "better-auth/plugins";

let auth = null;
export const handleBetterAuth = async () => {
	if (auth) return auth;
	const { db } = await handleMongoDbConnection();
	auth = betterAuth({
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
		secret: process.env.BETTER_AUTH_SECRET,
		baseURL: process.env.BETTER_AUTH_URL,
		trustedOrigins: ["http://localhost:3000"],
		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			},
		},
	});

	return auth;
};
