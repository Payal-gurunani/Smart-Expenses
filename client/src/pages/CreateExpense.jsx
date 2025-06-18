import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '../config/apiRequest';
import { endpoints } from '../config/endPoints';

const CreateExpense = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    notes: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Using your fetch-based apiRequest utility and defined endpoints
      const response = await apiRequest(endpoints.CreateExpense, formData);

      alert(response.message || "Expense created successfully!");

      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: '',
        notes: '',
        imageUrl: '',
      });
    } catch (error) {
      console.error(error);
      alert(error.message || "Error creating expense");
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
        <h2 className="text-2xl font-bold text-[#114AB1] mb-6 text-center">Create New Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6793AC]"
          />
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6793AC]"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6793AC]"
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6793AC]"
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6793AC]"
          />
          <input
            name="imageUrl"
            type="url"
            placeholder="Image URL (optional)"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6793AC]"
          />
          <button
            type="submit"
            className="w-full bg-[#E4580B] text-white font-semibold py-2 rounded-lg hover:bg-[#c54408] transition"
          >
            Add Expense
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateExpense;
