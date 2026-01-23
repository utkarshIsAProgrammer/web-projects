import express from "express";
import "dotenv/config";
import { connectDB } from "./libs/db.js";
import noteRoutes from "./routes/note.route.js";
import cors from "cors";

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/note", noteRoutes);

connectDB().then(() => {
	app.listen(port, () => {
		console.log("Server started on PORT:", port);
	});
});
