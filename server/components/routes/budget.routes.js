import { Router } from "express";
import {setMonthlyBudget , getMonthlyBudget} from '../controllers/monthlyBudget.controller.js'
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").post(authenticateUser,setMonthlyBudget);
router.route("/:year/:month").get(authenticateUser,getMonthlyBudget)

export default router