import { Router } from "express";
import { createExpense, getExpenses } from "../controllers/expense.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = Router()
router.route('/create-expense').post(authenticateUser,createExpense);
router.route('/get-expenses').get(authenticateUser,getExpenses)
export default router