import React from "react";
import { motion } from "framer-motion";

const ExpenseCard = ({ expense, onView, onDelete, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-md rounded-xl p-4 border-t-4 border-[#6793AC]"
    >
      <h2 className="text-lg font-semibold text-[#114AB1]">{expense.title}</h2>
      <p className="text-sm text-gray-600">₹ {expense.amount}</p>
      <p className="text-sm text-gray-600">Category: {expense.category}</p>
      <p className="text-sm text-gray-600">Date: {new Date(expense.date).toLocaleDateString()}</p>
      <div className="flex gap-4 mt-4">
        <button onClick={async () => onView(expense)} className="text-sm text-[#114AB1] hover:underline">View</button>
        <button onClick={onDelete} className="text-sm text-red-600 hover:underline">Delete</button>
        <button onClick={onEdit} className="text-sm text-green-600 hover:underline">Edit</button>
      </div>
    </motion.div>
  );
};

export default ExpenseCard;
