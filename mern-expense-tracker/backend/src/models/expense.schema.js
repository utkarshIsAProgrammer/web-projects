import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
			trim: true,
		},

		amount: {
			type: Number,
			required: true,
			min: 0.01,
		},

		date: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;

/* 

1. Expense Entry
            Fields: description, amount (number), date, category (e.g., Food, Transport, Rent)
						Validation: amount > 0, valid date, required fields
2. List All Expenses
						Return all expenses sorted by date (newest first)
3. Get Single Expense by ID
4. Update & Delete Expense
5. Total Expenses Summary
						Endpoint that returns the total amount spent (use Mongoose .aggregate() or .sum() via map-reduce)

 */
