import { asyncHandler} from "../utils/asyncHandler.js";
import { MonthlyBudget } from "../models/monthlyBudgets.model.js";
import { Expense } from "../models/Expense.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const setMonthlyBudget = asyncHandler(async (req, res) => {
  const { month, year, budgetAmount } = req.body;
  const userId = req.user._id;

  if (!month || !year || !budgetAmount) {
    throw new ApiError(400,"Month , year and budget amout are")    
}
  const budget = await MonthlyBudget.findOneAndUpdate(
    { userId, month, year },
    { budgetAmount },
    { new: true, upsert: true }
  )
   res.status(200).json(
   new ApiResponse(200,budget,"Monthly budget saved")
  );
});

export const getMonthlySummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const expenses = await Expense.find({ userId });

  const summary = [];

  const grouped = {};

  // Group expenses by month-year
  for (const exp of expenses) {
    const date = new Date(exp.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${month}-${year}`;

    if (!grouped[key]) {
      grouped[key] = {
        month,
        year,
        totalAmount: 0,
        categories: {},
      };
    }

    grouped[key].totalAmount += exp.amount;
    grouped[key].categories[exp.category] = (grouped[key].categories[exp.category] || 0) + exp.amount;
  }

  // Add budget info
  for (const key in grouped) {
    const { month, year, totalAmount, categories } = grouped[key];
if (totalAmount === 0) continue;

    const budget = await MonthlyBudget.findOne({ userId, month, year });

    summary.push({
      _id: { month, year },
      totalAmount,
      categories: Object.entries(categories).map(([category, amount]) => ({ category, amount })),
      budgetAmount: budget?.budgetAmount || null, // ✅ Add this line
    });
  }
summary.sort((a, b) => {
  const aDate = new Date(a._id.year, a._id.month - 1);
  const bDate = new Date(b._id.year, b._id.month - 1);
  return bDate - aDate; // descending
});

  res.status(200).json(
    new ApiResponse(200,summary,"get data")
  );
});