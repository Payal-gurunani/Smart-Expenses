import React from "react";
import { useNavigate } from "react-router-dom";

const BudgetInputBar = ({
  budgetInput,
  setBudgetInput,
  budgetButtonState,
  handleBudgetSubmit,
}) => {
  const navigate = useNavigate(); // ✅ Get the navigate function

  return (
    <div className="mt-4 text-center">
      <input
        type="number"
        placeholder="Enter monthly budget"
        value={budgetInput}
        onChange={(e) => setBudgetInput(e.target.value)}
        className="border p-2 rounded-md mr-2 w-48"
      />
      <button
        onClick={handleBudgetSubmit}
        disabled={budgetButtonState.disabled}
        className={`px-4 py-2 rounded-lg ${
          budgetButtonState.disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#E4580B] hover:bg-[#c54408] text-white"
        }`}
      >
        {budgetButtonState.label}
      </button>

      {/* ✅ Use navigate instead of <a href=""> */}
      <div className="mt-2">
        <button
          onClick={() => {
            localStorage.removeItem("selectedMonthKey");
            navigate("/")}} // Adjust route as needed
          className="text-blue-400 hover:underline"
        >
          ← Back to yearly Expenses
        </button>
      </div>
    </div>
  );
};

export default BudgetInputBar;
