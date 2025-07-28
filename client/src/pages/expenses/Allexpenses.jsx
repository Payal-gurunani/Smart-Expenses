import React, { useEffect, useState } from "react";
import { apiRequest } from "../../config/apiRequest";
import { endpoints } from "../../config/endPoints";
import ViewExpenseModal from "./ViewExpenseModal";
import DeleteModal from "./DeleteModal";
import ExpenseList from "./ExpenseList";
import BudgetInputBar from "./BudgetInputBar";
import MonthlySummaryGrid from "./MonthlySummaryGrid";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
const handleSetMonth = (key) => {
  setSelectedMonthKey(key);
  localStorage.setItem("selectedMonthKey", key);
};
  useEffect(() => {
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [summaryRes, expensesRes] = await Promise.all([
        apiRequest(endpoints.Summary),
        apiRequest(endpoints.GetExpense),
      ]);

      setMonthlySummary(Array.isArray(summaryRes.data.data) ? summaryRes.data.data : []);
      setExpenses(Array.isArray(expensesRes.data) ? expensesRes.data : []);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAll();
}, [refetch]);

  useEffect(() => {
  const storedKey = localStorage.getItem("selectedMonthKey");
  if (storedKey && !selectedMonthKey) {
    setSelectedMonthKey(storedKey);
  }
}, []);

const handleDelete = async () => {
  try {
    const res = await apiRequest(endpoints.DeleteExpense(expenseToDelete._id))
    setDeleteConfirm(false);
    setExpenseToDelete(null);
    toast.success("Expense deleted successfully!");
    setRefetch((prev) => !prev);
  } catch (err) {
    console.error("Delete failed", err);
  }
};

useEffect(() => {
  if (selectedMonthKey) {
    const storedBudget = localStorage.getItem(`budget-${selectedMonthKey}`);
    if (storedBudget) {
      setMonthlyBudget(Number(storedBudget));
      setBudgetInput(storedBudget); // for input field
    }
  }
}, [selectedMonthKey]);

useEffect(() => {
  if (
    selectedMonthKey &&
    monthlyBudget !== null &&
    budgetInput !== String(monthlyBudget)
  ) {
    setBudgetInput(String(monthlyBudget));
  }
}, [monthlyBudget, selectedMonthKey]);

  const mergedSummaries = monthlySummary.map((summary) => {
    const key = `${summary._id.month}-${summary._id.year}`;
    return {
      ...summary,
      key,
      budgetAmount: summary.budgetAmount ?? null,
    };
  });

  const getBudgetButtonState = () => {
    if (budgetLoading) return { label: "Saving...", disabled: true };

const trimmedInput = String(budgetInput).trim();
    const isValid = trimmedInput !== "" && !isNaN(trimmedInput) && Number(trimmedInput) > 0;

    if (!monthlyBudget && isValid) {
      return { label: "Save Budget", disabled: false };
    }

    const inputValue = Number(trimmedInput);
    const currentValue = Number(monthlyBudget);

    if (inputValue !== currentValue && isValid) {
      return { label: "Update Budget", disabled: false };
    }

    return { label: "Budget Set", disabled: true };
  };

  const budgetButtonState = getBudgetButtonState();

const handleBudgetSubmit = async () => {
  const inputValue = budgetInput.trim() || localStorage.getItem(`budget-${selectedMonthKey}`);
  if (!inputValue || isNaN(inputValue)) {
    toast.error("Please enter a valid number");
    return;
  }

  const budgetAmount = Number(inputValue);
  if (budgetAmount <= 0) {
    toast.error("Budget must be greater than 0");
    return;
  }

  try {
    setBudgetLoading(true);
    const [month, year] = selectedMonthKey.split("-");

    await apiRequest(endpoints.SetMonthlyBudget, {
      month: parseInt(month),
      year: parseInt(year),
      budgetAmount,
    });

    toast.success(`Budget ${monthlyBudget === null ? "saved" : "updated"} successfully!`);
    setMonthlyBudget(budgetAmount);

    localStorage.setItem(`budget-${selectedMonthKey}`, budgetAmount);
    setBudgetInput(budgetAmount); // Keep input in sync
    setRefetch((prev) => !prev);
  } catch (err) {
    toast.error("Failed to save budget");
    console.error(err);
  } finally {
    setBudgetLoading(false);
  }
};

  if (loading)
    return <div className="text-center mt-10 text-[#114AB1]">Loading expenses...</div>;

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
  <>
      <div className="text-center mt-6 mb-4">
      <h1 className="text-3xl font-bold text-[#114AB1]">Your Expenses</h1>
      <p className="text-gray-600 text-sm">Track, manage, and review your spending</p>
    </div>
    <div className="flex justify-center p-4 m-4">
  <button
    onClick={() => navigate('/create-expense')}
    className="bg-[#114AB1]  text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#0c3a8e] cursor-pointer transition"
  >
     Create Expense
  </button>
</div>

  {
   !selectedMonthKey ? (
    <MonthlySummaryGrid
      mergedSummaries={mergedSummaries}
      setSelectedMonthKey={handleSetMonth}
      visibleCharts={visibleCharts}
      setVisibleCharts={setVisibleCharts}
    />
  ) : (
    <>
      <BudgetInputBar
        budgetInput={budgetInput}
        setBudgetInput={setBudgetInput}
        budgetButtonState={budgetButtonState}
        handleBudgetSubmit={handleBudgetSubmit}
      />
      <ExpenseList
        expenses={expenses}
        selectedMonthKey={selectedMonthKey}
        setSelectedExpense={setSelectedExpense}
        setExpenseToDelete={setExpenseToDelete}
        setDeleteConfirm={setDeleteConfirm}
        navigate={navigate}
      />
      <DeleteModal
  deleteConfirm={deleteConfirm}
  expenseToDelete={expenseToDelete}
  onConfirmDelete={handleDelete}
  onCancel={() => {
    setDeleteConfirm(false);
    setExpenseToDelete(null);
  }}
/>
<ViewExpenseModal
  expense={selectedExpense}
  onClose={() => setSelectedExpense(null)}
/>

    </>
  )}
  </>
  )
};

export default AllExpenses;
