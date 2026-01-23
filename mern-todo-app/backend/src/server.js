import express from "express";
import "dotenv/config";
import taskRoutes from "./routes/task.route.js";
import { connectDB } from "./libs/db.js";
import cors from "cors";

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/todo", taskRoutes);

connectDB().then(() => {
	app.listen(port, () => {
		console.log("Server started on PORT:", port);
	});
});
