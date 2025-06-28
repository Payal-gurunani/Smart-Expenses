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


export const getMonthlyBudget = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { year, month } = req.params;

  if (!month || !year) {
    throw new ApiError(400, "Month and year are required");
  }

  const yearNum = parseInt(year);
  const monthNum = parseInt(month);

  console.log("Looking for budget with:", {
    userId,
    year: yearNum,
    month: monthNum,
  });

  const budget = await MonthlyBudget.findOne({
    userId,
    month: monthNum,
    year: yearNum,
  });


  res.status(200).json({
    budgetAmount: budget?.budgetAmount ?? null,
  });
});
