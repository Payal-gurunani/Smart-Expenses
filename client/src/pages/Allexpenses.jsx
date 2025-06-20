import React, { useEffect, useState } from "react";
import { apiRequest } from "../config/apiRequest";
import { endpoints } from "../config/endPoints";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
const AllExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [selectedMonthKey, setSelectedMonthKey] = useState(null);
    const [refetch, setRefetch] = useState(false);

    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const [summaryRes, expensesRes] = await Promise.all([
                apiRequest(endpoints.Summary),
                apiRequest(endpoints.GetExpense),
            ]);
            setMonthlySummary(summaryRes.data);
            setExpenses(expensesRes.data);

            if (selectedMonthKey) {
                const hasExpensesInMonth = expensesRes.data.some((exp) => {
                    const date = new Date(exp.date);
                    const key = `${date.getMonth() + 1}-${date.getFullYear()}`;
                    return key === selectedMonthKey;
                });

                if (!hasExpensesInMonth) {
                    setSelectedMonthKey(null);
                }
            }

        } catch (err) {
            console.error("Error fetching data", err);
            toast.error("Error fetching expense.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [refetch]);

    if (loading) return <div className="text-center mt-10 text-[#114AB1]">Loading expenses...</div>;
    if (!loading && expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-16 text-center text-[#114AB1]">
                <ToastContainer position="top-center" autoClose={2000} />
                <img
                    src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
                    alt="No expenses"
                    className="w-40 h-40 mb-6 opacity-80"
                />
                <h2 className="text-2xl font-semibold mb-2">No expenses yet!</h2>
                <p className="text-gray-600 mb-4">Track your spending and take control of your finances.</p>
                <button
                    onClick={() => navigate("/create-expense")}
                    className="bg-[#E4580B] text-white px-6 py-2 rounded-lg hover:bg-[#c54408] transition"
                >
                    + Create your first expense
                </button>
            </div>
        );
    }

    const groupedSummaries = {};

    monthlySummary.forEach((summary) => {
        const key = `${summary._id.month}-${summary._id.year}`;
        if (!groupedSummaries[key]) {
            groupedSummaries[key] = {
                ...summary,
                totalAmount: summary.totalAmount,
                count: summary.count,
            };
        } else {
            // Merge totals
            groupedSummaries[key].totalAmount += summary.totalAmount;
            groupedSummaries[key].count += summary.count;
        }
    });

    const mergedSummaries = Object.entries(groupedSummaries).map(([key, value]) => ({
        ...value,
        key,
    }));

    return (
        <div className="p-4 md:p-8 bg-[#F5F9FF] min-h-screen">
            <h1 className="text-3xl font-bold text-[#114AB1] mb-6 text-center">Your Expenses</h1>

            <button
                onClick={() => navigate("/create-expense")}
                className="bg-[#E4580B] text-white px-4 py-2 m-3 rounded-lg hover:bg-[#c54408] transition"
            >
                + Add more Expense
            </button>
            {!selectedMonthKey && (

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {mergedSummaries.map((summary) => {
                        const monthName = new Date(summary._id.year, summary._id.month - 1).toLocaleString("default", { month: "long" });
                        return (
                            <motion.div
                                key={summary.key}
                                className="bg-white shadow-md rounded-xl p-4 border-t-4 border-[#6793AC]"
                            >
                                <h2 className="text-lg font-bold text-[#114AB1]">
                                    {monthName} {summary._id.year}
                                </h2>
                                <p className="text-gray-600 text-sm">Total Spent: ₹{summary.totalAmount}</p>
                                <p className="text-gray-600 text-sm">Expenses: {summary.count}</p>
                                <button
                                    className="mt-3 text-sm text-blue-600 underline"
                                    onClick={() => setSelectedMonthKey(summary.key)}
                                >

                                    View Details
                                </button>
                            </motion.div>
                        );
                    })}

                </div>
            )}

            {selectedMonthKey && (
                <>
                    <button
                        onClick={() => setSelectedMonthKey(null)}
                        className="text-sm text-blue-600 underline mt-4"
                    >
                        ← Back to monthly summary
                    </button>

                    <h2 className="text-2xl font-bold text-center mt-6 text-[#114AB1]">
                        {new Date(Number(selectedMonthKey.split("-")[1]), Number(selectedMonthKey.split("-")[0]) - 1).toLocaleString("default", { month: "long", year: "numeric" })} Expenses
                    </h2>

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
                        {expenses
                            .filter((exp) => {
                                const date = new Date(exp.date);
                                const key = `${date.getMonth() + 1}-${date.getFullYear()}`;
                                return key === selectedMonthKey;
                            })
                            .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ascending
                            .map((expense) => (
                                <motion.div
                                    key={expense._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white shadow-md rounded-xl p-4 border-t-4 border-[#6793AC]"
                                >
                                    <h2 className="text-lg font-semibold text-[#114AB1]">{expense.title}</h2>
                                    <p className="text-sm text-gray-600">₹ {expense.amount}</p>
                                    <p className="text-sm text-gray-600">Category: {expense.category}</p>
                                    <p className="text-sm text-gray-600">Date: {new Date(expense.date).toLocaleDateString()}</p>
                                    {/* {expense.notes && <p className="text-xs mt-1 italic text-gray-500">Notes: {expense.notes}</p>} */}

                                    <div className="flex gap-4 mt-4">
                                        <button
                                            onClick={async () => {
                                                const res = await apiRequest(endpoints.GetExpenseById(expense._id));
                                                setSelectedExpense(res.data);
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
                            ))}
                    </div>
                </>
            )}


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
                                        setRefetch(prev => !prev);
                                        toast.success("Expense deleted successfully!");

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
