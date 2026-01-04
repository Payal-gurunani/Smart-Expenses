
const InsightsCard = ({ totalSpent, monthlyBudget, expenses, selectedMonthKey }) => {
  // Prepare insights
  const insights = [];

  // Budget overflow / safe
  if (monthlyBudget !== null && totalSpent > monthlyBudget) {
    insights.push(`⚠️ You exceeded your budget by ₹${totalSpent - monthlyBudget}!`);
  } else if (monthlyBudget !== null) {
    insights.push(`✅ You are within your budget. Total spent: ₹${totalSpent}`);
  }

 // Food category insight
const foodSpent = expenses
  .filter(e => e.category && e.category.toLowerCase() === "food")
  .reduce((acc, curr) => acc + curr.amount, 0);

const foodPercentage = totalSpent ? ((foodSpent / totalSpent) * 100).toFixed(1) : 0;

if (foodPercentage > 0 && foodPercentage > 30) {
  insights.push(`🍔 You spent ${foodPercentage}% of your total expenses on Food this month — high spending!`);
}

  // Last month comparison
  const lastMonthKey = (() => {
    if (!selectedMonthKey) return null;
    const [month, year] = selectedMonthKey.split("-").map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    return `${prevMonth}-${prevYear}`;
  })();

  const lastMonthExpenses = expenses.filter(exp => {
    if (!lastMonthKey) return false;
    const expenseMonthKey = `${new Date(exp.date).getMonth() + 1}-${new Date(exp.date).getFullYear()}`;
    return expenseMonthKey === lastMonthKey;
  });

  const lastMonthTotal = lastMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  if (lastMonthExpenses.length > 0) {
  if (lastMonthTotal > totalSpent) {
    insights.push(`💰 You saved ₹${lastMonthTotal - totalSpent} compared to last month!`);
  } else if (lastMonthTotal < totalSpent) {
    insights.push(`⚠️ Spending increased by ₹${totalSpent - lastMonthTotal} compared to last month.`);
  }
}

  // Render insights
  if (insights.length === 0) return null;

  return (
    <div className="bg-yellow-50 p-4 rounded-md mb-4 mx-4 shadow-md">
      <h3 className="font-semibold mb-2 text-[#114AB1]">💡 Insights</h3>
      <ul className="list-disc list-inside text-gray-800">
        {insights.map((insight, idx) => (
          <li key={idx}>{insight}</li>
        ))}
      </ul>
    </div>
  );
};

export default InsightsCard;
