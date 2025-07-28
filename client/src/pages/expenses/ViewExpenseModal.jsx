import React from "react";
import { motion } from "framer-motion";

const ViewExpenseModal = ({ expense, onClose }) => {
  if (!expense) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-[#114AB1] mb-4">Expense Details</h2>
        <div className="text-left space-y-2">
          <p><strong>Title:</strong> {expense.title}</p>
          <p><strong>Amount:</strong> ₹ {expense.amount}</p>
          <p><strong>Category:</strong> {expense.category}</p>
          <p><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
          {expense.notes && <p><strong>Notes:</strong> {expense.notes}</p>}
          {expense.imageUrl && (
            <div>
              <strong>Receipt:</strong>
              <img src={expense.imageUrl} alt="Receipt" className="mt-2 w-full max-h-64 object-cover" />
            </div>
          )}
        </div>
        <div className="mt-6 text-center">
          <button onClick={onClose} className="px-4 py-2 bg-[#6793AC] text-white rounded hover:bg-[#114AB1]">
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewExpenseModal;
