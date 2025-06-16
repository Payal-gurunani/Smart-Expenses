import { Router } from "express";
import { createExpense, deleteExpense, getExpenseById, getExpenses, getExpenseSummary, updateExpense } from "../controllers/expense.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = Router()
router.route('/create-expense').post(authenticateUser,createExpense);
router.route('/get-expenses').get(authenticateUser,getExpenses)
router.route('/expense/:expenseId').get(authenticateUser,getExpenseById)
router.route('/expense/:expenseId').put(authenticateUser,updateExpense)
router.route('/expense/:expenseId').delete(authenticateUser,deleteExpense)
router.route('/summary').get(authenticateUser,getExpenseSummary)
export default router