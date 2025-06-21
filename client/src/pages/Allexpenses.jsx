import React, { useEffect, useState } from "react";
import { apiRequest } from "../config/apiRequest";
import { endpoints } from "../config/endPoints";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [selectedMonthKey, setSelectedMonthKey] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [visibleCharts, setVisibleCharts] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
const [budgetManuallyUpdated, setBudgetManuallyUpdated] = useState(false);

  const COLORS = ["#114AB1", "#6793AC", "#E4580B", "#82ca9d", "#FFBB28", "#FF8042"];
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [summaryRes, expensesRes] = await Promise.all([
        apiRequest(endpoints.Summary),
        apiRequest(endpoints.GetExpense),
      ]);
      setMonthlySummary(Array.isArray(summaryRes.data.data) ? summaryRes.data.data : []);
      setExpenses(Array.isArray(expensesRes.data) ? expensesRes.data : []);

      if (selectedMonthKey) {
        const [month, year] = selectedMonthKey.split("-");
        const budgetRes = await apiRequest(endpoints.GetMonthlyBudget(year, month));
        setMonthlyBudget(budgetRes.data?.budgetAmount || null);
      }
      

    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refetch, selectedMonthKey]);

useEffect(() => {
  if (monthlyBudget !== null && !budgetManuallyUpdated) {
    setBudgetInput(monthlyBudget.toString());
  }
}, [monthlyBudget]);


 const mergedSummaries = monthlySummary.map((summary) => {
  const key = `${summary._id.month}-${summary._id.year}`;
  return {
    ...summary,
    key,
    budgetAmount: summary.budgetAmount ?? null, // 🛠 explicitly carry it forward
  };
});


  const selectedSummary = mergedSummaries.find((s) => s.key === selectedMonthKey);
  const isBudgetValid = budgetInput !== "" && !isNaN(budgetInput) && Number(budgetInput) > 0;
const isBudgetSame = parseInt(budgetInput) === parseInt(monthlyBudget);

const budgetButtonLabel = budgetLoading
  ? "Saving..."
  : monthlyBudget === null
    ? "Save Budget"
    : isBudgetValid && !isBudgetSame
    ? "Update"
    : "Budget Set";



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

  return (
    <div className="p-4 md:p-8 bg-[#F5F9FF] min-h-screen">
      <ToastContainer position="top-center" autoClose={2000} />
      <h1 className="text-3xl font-bold text-[#114AB1] mb-6 text-center">Your Expenses</h1>

      <button
        onClick={() => navigate("/create-expense")}
        className="bg-[#E4580B] text-white px-4 py-2 m-3 rounded-lg hover:bg-[#c54408] transition cursor-pointer"
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

                {summary.budgetAmount !== undefined && (
                  <div className="mt-2 text-sm font-medium text-[#114AB1]">
                    Budget: ₹{summary.budgetAmount} |{" "}
                    Leftover: ₹{Math.max(summary.budgetAmount - summary.totalAmount, 0)}
                  </div>
                )}

                <button
                  onClick={() =>
                    setVisibleCharts((prev) => ({ ...prev, [summary.key]: !prev[summary.key] }))
                  }
                  className="mt-2 text-sm text-[#E4580B] underline"
                >
                  {visibleCharts[summary.key] ? "Hide Category Breakdown" : "Show Category Breakdown"}
                </button>

                {visibleCharts[summary.key] && (
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={
                            summary.budgetAmount !== undefined
                              ? [
                                  { name: "Spent", value: summary.totalAmount },
                                  {
                                    name: "Leftover",
                                    value: Math.max(summary.budgetAmount - summary.totalAmount, 0),
                                  },
                                ]
                              : summary.categories
                          }
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          label
                        >
                          {(summary.budgetAmount
                            ? [
                                { name: "Spent", value: summary.totalAmount },
                                {
                                  name: "Leftover",
                                  value: Math.max(summary.budgetAmount - summary.totalAmount, 0),
                                },
                              ]
                            : summary.categories
                          ).map((entry, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <button
                  className="mt-3 ml-3 text-sm text-blue-600 underline"
                  onClick={() => {
                    console.log("Clicked month:", summary.key);
                    setSelectedMonthKey(summary.key);
                  }}
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
    {/* Budget input - always visible */}
    <div className="mt-4 text-center">
      <input
        type="number"
        placeholder="Enter your monthly budget"
        value={budgetInput}
         onChange={(e) => {
    setBudgetInput(e.target.value);
    setBudgetManuallyUpdated(true);
  }}
        className="border p-2 rounded-md mr-2 w-48"
      />
    <button
  onClick={async () => {
  if (!budgetInput || isNaN(budgetInput) || Number(budgetInput) <= 0) {
    toast.error("Enter a valid budget amount");
    return;
  }

  try {
    setBudgetLoading(true);
    const [month, year] = selectedMonthKey.split("-");
    await apiRequest(endpoints.SetMonthlyBudget, {
      month: parseInt(month),
      year: parseInt(year),
      budgetAmount: parseInt(budgetInput),
    });

    toast.success("Budget saved!");

    const [updatedSummaryRes, updatedExpensesRes] = await Promise.all([
      apiRequest(endpoints.Summary),
      apiRequest(endpoints.GetExpense),
    ]);
    setMonthlySummary(updatedSummaryRes.data.data || []);
    setExpenses(updatedExpensesRes.data || []);
    setMonthlyBudget(parseInt(budgetInput));

    // Reset input and flag
    
    setBudgetManuallyUpdated(false);

    setRefetch((prev) => !prev);
    setTimeout(() => {
      setVisibleCharts((prev) => ({ ...prev, [selectedMonthKey]: true }));
    }, 100);
  } catch (err) {
    toast.error("Error saving budget");
  } finally {
    setBudgetLoading(false);
  }
}}

  className="bg-[#E4580B] text-white px-4 py-2 m-3 rounded-lg hover:bg-[#c54408] transition cursor-pointer"
>
  {budgetButtonLabel}
</button>

    </div>

    <button
      onClick={() => setSelectedMonthKey(null)}
      className="text-sm text-blue-600 underline mt-4 cursor-pointer"
    >
      ← Back to monthly summary
    </button>

    <h2 className="text-2xl font-bold text-center mt-6 text-[#114AB1]">
      {new Date(Number(selectedMonthKey.split("-")[1]), Number(selectedMonthKey.split("-")[0]) - 1).toLocaleString("default", { month: "long", year: "numeric" })} Expenses
    </h2>

    {selectedSummary?.categories?.map((cat) => (
      <div key={cat.category} className="text-sm text-center text-gray-700">
        <strong>{cat.category}</strong>: ₹{cat.amount}
      </div>
    ))}

    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
      {expenses
        .filter((exp) => {
          const date = new Date(exp.date);
          const key = `${date.getMonth() + 1}-${date.getFullYear()}`;
          return key === selectedMonthKey;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
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
            <p className="text-sm mb-6">
              Are you sure you want to delete <strong>{expenseToDelete.title}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  await apiRequest(endpoints.DeleteExpense(expenseToDelete._id));
                  setDeleteConfirm(false);
                  setExpenseToDelete(null);
                  setRefetch((prev) => !prev);
                  toast.success("Expense deleted successfully!");
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
