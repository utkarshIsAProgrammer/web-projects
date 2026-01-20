import express from "express";
import authRoutes from "./routes/auth.route.js";
import "dotenv/config";
import { connectDB } from "./libs/db.js";

const port = process.env.PORT || 5000;
const app = express();

app.use("/auth", authRoutes);

connectDB().then(() => {
	app.listen(port, () => {
		console.log("Server started on PORT:", port);
	});
});
