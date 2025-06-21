import { Router } from "express";
import {setMonthlyBudget , getMonthlySummary} from '../controllers/monthlyBudget.controller.js'
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").post(authenticateUser,setMonthlyBudget);
router.route("/:year/:month").get(authenticateUser,getMonthlySummary)

export default router