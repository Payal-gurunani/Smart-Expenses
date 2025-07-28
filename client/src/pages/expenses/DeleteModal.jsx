import React from "react";
import { motion } from "framer-motion";

const DeleteModal = ({ deleteConfirm, expenseToDelete, onConfirmDelete, onCancel }) => {
  if (!deleteConfirm || !expenseToDelete) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
        <h2 className="text-lg font-semibold text-[#114AB1] mb-4">Confirm Delete</h2>
        <p className="text-sm mb-6">
          Are you sure you want to delete <strong>{expenseToDelete.title}</strong>?
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes, Delete</button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    </motion.div>
  );
};

export default DeleteModal;
