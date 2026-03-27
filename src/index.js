import express from "express";
import { handleBetterAuth } from "./config/auth.js";
import { toNodeHandler } from "better-auth/node";
const app = express();
const auth = await handleBetterAuth();
app.use("/api/auth", toNodeHandler(auth));
app.listen(3001, () => {
	console.log("Server started at port 3001");
});
