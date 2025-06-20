import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import {Expense} from '../models/Expense.model.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';
export const createExpense = asyncHandler(async(req , res)=>{
    const {title , amount , category,date,notes,imageUrl} = req.body;
    const userId = req.user._id;
   
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
        new ApiResponse(200,allExpenses,"Expenses get successfully")
    )
})

export const getExpenseById = asyncHandler(async (req, res) => {
    const { expenseId } = req.params;
    const userId = req.user._id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
        throw new ApiError(400, 'Invalid expense ID');
    }

    // Find the expense that belongs to the user
    const expense = await Expense.findOne({ _id: expenseId, userId });

    if (!expense) {
        throw new ApiError(404, 'Expense not found or unauthorized');
    }

    res.status(200).json(
        new ApiResponse(200, expense, 'Expense fetched successfully')
    );
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.expenseId;
  const userId = req.user._id;
  const updates = req.body;
  
    
  // 1. Find the expense
  const expense = await Expense.findById(expenseId);

  // 2. Check if expense exists
  if (!expense) {
    throw new ApiError(404, 'Expense not found');
  }

  // 3. Check ownership
  if (expense.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not authorized to update this expense');
  }

  // 4. Update and save
  Object.assign(expense, updates);
  await expense.save();

  res.status(200).json(
    new ApiResponse(200, expense, 'Expense updated successfully')
  );
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.expenseId;
  const userId = req.user._id;

  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new ApiError(404, 'Expense not found');
  }

  if (expense.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this expense');
  }

  await Expense.findByIdAndDelete(expenseId);

  res.status(200).json(
    new ApiResponse(200, null, 'Expense deleted successfully')
  );
});

export const getExpenseSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { startDate, endDate, page = 1, limit = 5 } = req.query;

  const matchStage = { userId };

  // Optional date range filtering
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const parsedLimit = parseInt(limit);

  const aggregation = await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          category: "$category"
        },
        categoryTotal: { $sum: "$amount" }
      }
    },
    {
      $group: {
        _id: { year: "$_id.year", month: "$_id.month" },
        categories: {
          $push: {
            category: "$_id.category",
            amount: "$categoryTotal"
          }
        },
        totalAmount: { $sum: "$categoryTotal" }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: parsedLimit }]
      }
    }
  ]);

  const summary = aggregation[0];
  const totalRecords = summary.metadata[0]?.total || 0;
  const totalPages = Math.ceil(totalRecords / limit);

  res.status(200).json(
    new ApiResponse(200, {
      currentPage: parseInt(page),
      totalPages,
      totalRecords,
      data: summary.data
    }, 'Expense summary fetched')
  );
});


// export const getExpenseSummary = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const summary = await Expense.aggregate([
//     { $match: { userId } }, // Only current user's expenses

//     {
//       $group: {
//         _id: {
//           category: '$category',
//           month: { $month: '$date' },
//           year: { $year: '$date' }
//         },
//         totalAmount: { $sum: '$amount' },
//         count: { $sum: 1 }
//       }
//     },
//     {
//       $sort: { '_id.year': -1, '_id.month': -1 } // Latest first
//     }
//   ]);

//   res.status(200).json(new ApiResponse(200, summary, 'Expense summary fetched'));
// });