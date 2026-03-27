import express from "express";
import { handleBetterAuth } from "./config/auth.js";
import { toNodeHandler } from "better-auth/node";
const app = express();
const auth = await handleBetterAuth();
app.all("/api/auth/", toNodeHandler(auth));
app.listen(5000, () => {
	console.log("Server started at port 5000");
});
