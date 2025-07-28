import React from "react";
import { motion } from "framer-motion";

const ExpenseDetailModal = ({ selectedExpense, onClose }) => {
  if (!selectedExpense) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
        <h2 className="text-xl font-bold text-[#114AB1] mb-2">{selectedExpense.title}</h2>
        <p><strong>Amount:</strong> ₹ {selectedExpense.amount}</p>
        <p><strong>Category:</strong> {selectedExpense.category}</p>
        <p><strong>Date:</strong> {new Date(selectedExpense.date).toLocaleDateString()}</p>
        {selectedExpense.notes && <p><strong>Notes:</strong> {selectedExpense.notes}</p>}
        {selectedExpense.imageUrl && <img src={selectedExpense.imageUrl} alt="Expense" className="mt-3 rounded-lg max-h-40 object-cover" />}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg">✕</button>
      </div>
    </motion.div>
  );
};

export default ExpenseDetailModal;
