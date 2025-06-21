// models/MonthlyBudget.js
import mongoose, { Schema } from "mongoose";

const monthlyBudgetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: { type: Number, required: true }, // 1 to 12
  year: { type: Number, required: true },
  budgetAmount: { type: Number, required: true }
});

monthlyBudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export const MonthlyBudget = mongoose.model("MonthlyBudget", monthlyBudgetSchema);
