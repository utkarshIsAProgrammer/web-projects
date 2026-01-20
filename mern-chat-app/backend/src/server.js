import express from "express";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use("/auth", authRoutes);

app.listen(5000, () => {
	console.log("Server started on port: 5000");
});
