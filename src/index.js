import express from "express";
import { handleBetterAuth } from "./config/auth.js";
import { toNodeHandler } from "better-auth/node";
import authRoutes from "./routes/authRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import announcementRoutes from "./routes/announcementRoute.js";
import cors from "cors";
const app = express();
const auth = await handleBetterAuth();
app.use(cors());
app.use(express.json());
app.use("/api/auth", toNodeHandler(auth));
app.use("/auth", authRoutes);
app.use("/school", schoolRoutes);
app.use("/announcement", announcementRoutes);
app.listen(3001, () => {
	console.log("Server started at port 3001");
});
