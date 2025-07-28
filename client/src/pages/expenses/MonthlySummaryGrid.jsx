import React from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#114AB1", "#6793AC", "#E4580B", "#82ca9d", "#FFBB28", "#FF8042"];

const MonthlySummaryGrid = ({ mergedSummaries, setSelectedMonthKey, visibleCharts, setVisibleCharts }) => {
  return (
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
            {summary.budgetAmount !== null && (
              <div className="mt-2 text-sm font-medium text-[#114AB1]">
                Budget: ₹{summary.budgetAmount} | Leftover: ₹{Math.max(summary.budgetAmount - summary.totalAmount, 0)}
              </div>
            )}
            <button
              onClick={() => setVisibleCharts(prev => ({ ...prev, [summary.key]: !prev[summary.key] }))}
              className="mt-2 text-sm text-[#E4580B] underline"
            >
              {visibleCharts[summary.key] ? "Hide Category Breakdown" : "Show Category Breakdown"}
            </button>
            {visibleCharts[summary.key] && (
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={
                        summary.budgetAmount !== null
                          ? [
                              { name: "Spent", value: summary.totalAmount },
                              { name: "Leftover", value: Math.max(summary.budgetAmount - summary.totalAmount, 0) }
                            ]
                          : summary.categories?.map(cat => ({ name: cat.category, value: cat.amount }))
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label
                    >
                      {(summary.budgetAmount !== null
                        ? [
                            { name: "Spent", value: summary.totalAmount },
                            { name: "Leftover", value: Math.max(summary.budgetAmount - summary.totalAmount, 0) }
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
              onClick={() => setSelectedMonthKey(summary.key)}
            >
              View Details
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MonthlySummaryGrid;
