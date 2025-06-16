import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import {Expense} from '../models/Expense.model.js'
import { ApiResponse } from '../utils/ApiResponse.js';

export const createExpense = asyncHandler(async(req , res)=>{
    const {title , amount , category,date,notes,imageUrl} = req.body;
    const userId = req.user._id;
    // console.log(userId,"User id");
    
    if(!title||!amount||!category){
        throw new ApiError(400,"Title , amount , category are required",)
    }

    const expense = await Expense.create({
        userId,title,amount,category,date,notes,imageUrl
    })
    // const createdExpense = await Expense.findById(expense._id)
    if(!expense){
        throw new ApiError(400,"Error in creation of expense")
    }

    return res.status(201).json(
        new ApiResponse(201 ,expense,"Expense Created successfully")
    )
})

export const getExpenses = asyncHandler(async (req,res)=>{
    const userId = req.user._id;
    const allExpenses = await Expense.find({userId})
   
    
    if(!allExpenses || allExpenses.length == 0){
        throw new ApiError(404,"No expenses available")
    }
    return res.status(200).json(
        new ApiResponse(200,"Expenses get successfully",allExpenses)
    )
})
