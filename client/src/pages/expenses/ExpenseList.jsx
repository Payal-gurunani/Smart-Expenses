import React from "react";
import ExpenseCard from "./ExpenseCard";

const ExpenseList = ({
  expenses,
  selectedMonthKey,
  setSelectedExpense,
  setExpenseToDelete,
  setDeleteConfirm,
  navigate,
}) => {
  const filteredExpenses = expenses
    .filter((exp) => {
      const date = new Date(exp.date);
      const key = `${date.getMonth() + 1}-${date.getFullYear()}`;
      return key === selectedMonthKey;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
      {filteredExpenses.map((expense) => (
        <ExpenseCard
          key={expense._id}
          expense={expense}
          onView={setSelectedExpense}
          onDelete={() => {
            setExpenseToDelete(expense);
            setDeleteConfirm(true);
          }}
          onEdit={() => navigate(`/update-expense/${expense._id}`)}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
