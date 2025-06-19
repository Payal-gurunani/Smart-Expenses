import React, { useEffect, useState } from "react";
import { apiRequest } from "../config/apiRequest";
import { endpoints } from "../config/endPoints";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const AllExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);

    const [loading, setLoading] = useState(true);
    const [selectedExpense, setSelectedExpense] = useState(null); // for viewing
    const navigate = useNavigate();

    const fetchExpenses = async () => {
        try {
            const res = await apiRequest(endpoints.GetExpense)
            console.log(res, "from get app");

            setExpenses(res.data);
        } catch (error) {
            console.error("Failed to load expenses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    if (loading) return <div className="text-center mt-10 text-[#114AB1]">Loading expenses...</div>;
    if (expenses.length === 0)
        return <div className="text-center mt-10 text-[#E4580B]">No expenses found.</div>;

    return (
        <div className="p-4 md:p-8 bg-[#F5F9FF] min-h-screen">
            <h1 className="text-3xl font-bold text-[#114AB1] mb-6 text-center">Your Expenses</h1>

            <button
                onClick={() => navigate("/create-expense")}
                className="bg-[#E4580B] text-white px-4 py-2 m-3 rounded-lg hover:bg-[#c54408] transition"
            >
                + Add more Expense
            </button>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {expenses.map((expense, index) => (
  <motion.div
    key={expense._id}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className="bg-white shadow-md rounded-xl p-4 border-t-4 border-[#6793AC]"
  >

                        <h2 className="text-lg font-semibold text-[#114AB1]">{expense.title}</h2>
                        <p className="text-sm text-gray-600">₹ {expense.amount}</p>
                        <p className="text-sm text-gray-600">Category: {expense.category}</p>
                        <p className="text-sm text-gray-600">Date: {new Date(expense.date).toLocaleDateString()}</p>
                        {expense.notes && <p className="text-xs mt-1 italic text-gray-500">Notes: {expense.notes}</p>}

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await apiRequest(endpoints.GetExpenseById(expense._id))
                                        setSelectedExpense(res.data);
                                    } catch (err) {
                                        console.error("Error fetching expense by ID", err);
                                    }
                                }}
                                className="text-sm text-[#114AB1] hover:underline"
                            >
                                View
                            </button>

                            <button
                                onClick={() => {
                                    setExpenseToDelete(expense);
                                    setDeleteConfirm(true);
                                }}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Delete
                            </button>


                            <button
                                onClick={() => navigate(`/update-expense/${expense._id}`)}
                                className="text-sm text-green-600 hover:underline"
                            >
                                Edit
                            </button>
                        </div>
                    </motion.div>

                    //   <motion.div
                    //     key={expense._id}
                    //     initial={{ opacity: 0, y: 30 }}
                    //     animate={{ opacity: 1, y: 0 }}
                    //     transition={{ duration: 0.4 }}
                    //     className="bg-white shadow-md rounded-xl p-4 border-t-4 border-[#6793AC]"
                    //   >
                    //     <h2 className="text-lg font-semibold text-[#114AB1]">{expense.title}</h2>
                    //     <p className="text-sm text-gray-600">₹ {expense.amount}</p>
                    //     <p className="text-sm text-gray-600">Category: {expense.category}</p>
                    //     <p className="text-sm text-gray-600">Date: {new Date(expense.date).toLocaleDateString()}</p>
                    //     {expense.notes && <p className="text-xs mt-1 italic text-gray-500">Notes: {expense.notes}</p>}
                    //   </motion.div>
                ))}
            </div>
            {deleteConfirm && expenseToDelete && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
                >
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                        <h2 className="text-lg font-semibold text-[#114AB1] mb-4">Confirm Delete</h2>
                        <p className="text-sm mb-6">Are you sure you want to delete <strong>{expenseToDelete.title}</strong>?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={async () => {
                                    try {
                                        await apiRequest(endpoints.DeleteExpense(expenseToDelete._id));
                                        setDeleteConfirm(false);
                                        setExpenseToDelete(null);
                                        fetchExpenses(); // refresh list
                                    } catch (err) {
                                        console.error("Error deleting expense", err);
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => {
                                    setDeleteConfirm(false);
                                    setExpenseToDelete(null);
                                }}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {selectedExpense && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
                        <h2 className="text-xl font-bold text-[#114AB1] mb-2">{selectedExpense.title}</h2>
                        <p><strong>Amount:</strong> ₹ {selectedExpense.amount}</p>
                        <p><strong>Category:</strong> {selectedExpense.category}</p>
                        <p><strong>Date:</strong> {new Date(selectedExpense.date).toLocaleDateString()}</p>
                        {selectedExpense.notes && <p><strong>Notes:</strong> {selectedExpense.notes}</p>}
                        {selectedExpense.imageUrl && (
                            <img
                                src={selectedExpense.imageUrl}
                                alt="Expense"
                                className="mt-3 rounded-lg max-h-40 object-cover"
                            />
                        )}
                        <button
                            onClick={() => setSelectedExpense(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}

        </div>
    );
};

export default AllExpenses;
