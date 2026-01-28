import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./libs/db.js";

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(() => {
	app.listen(port, () => [console.log("Server started on PORT:", port)]);
});
