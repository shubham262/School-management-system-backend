import express from "express";
import { handleBetterAuth } from "./config/auth.js";
import { toNodeHandler } from "better-auth/node";
import authRoutes from "./routes/authRoutes.js";
const app = express();
const auth = await handleBetterAuth();
app.use(express.json());
app.use("/api/auth", toNodeHandler(auth));
app.use("/auth", authRoutes);
app.listen(3001, () => {
	console.log("Server started at port 3001");
});


