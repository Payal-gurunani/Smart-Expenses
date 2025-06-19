import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../config/apiRequest";
import { endpoints } from "../config/endPoints";
import { motion } from "framer-motion";

const UpdateExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    notes: '',
    imageUrl: '',
  });

  // Fetch current data to pre-fill
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await apiRequest(endpoints.GetExpenseById(id))
        const expense = res.data;
        setFormData({
          title: expense.title || '',
          amount: expense.amount || '',
          category: expense.category || '',
          date: expense.date ? expense.date.slice(0, 10) : '',
          notes: expense.notes || '',
          imageUrl: expense.imageUrl || '',
        });
      } catch (err) {
        console.error("Failed to fetch expense", err);
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(endpoints.UpdateExpense(id), formData);
      alert("Expense updated successfully!");
      navigate("/all-expenses");
    } catch (err) {
      console.error("Failed to update expense", err);
      alert("Error updating expense.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-[#114AB1] mb-6 text-center">Update Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            name="imageUrl"
            type="url"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-[#E4580B] text-white py-2 rounded-lg hover:bg-[#c54408]"
          >
            Update Expense
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateExpense;
