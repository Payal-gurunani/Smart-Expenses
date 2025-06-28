import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {apiRequest} from '../config/apiRequest.js';
import {endpoints} from '../config/endPoints.js'
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
// import { useNavigate } from 'react-router-dom';
const Register = () => {
  const [form, setForm] = useState({ username: '', email: '',password: '' });
const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const { isAuthenticated } = useAuth();
const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiRequest(endpoints.Register, form);
     
      
      if (response.success) {
        toast.success('Registration successful! Please login.')
        // alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        toast.error("Registration failed. Please try again.")
        setError(response.message || 'Registration failed. Please try again.');
      }
    } 
    catch (err) {
  let message = 'Something went wrong.';

  if (err?.message) {
    message = err.message;
  }

  setError(message);
}
 finally {
    setLoading(false);
  }
};
useEffect(() => {
    if (isAuthenticated) {
      navigate("/all-expenses"); // Redirect if already logged in
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; // Prevent flicker
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-[Poppins] text-white">
      {/* Left Panel */}
      <div className="relative md:w-1/2 w-full h-[300px] md:h-auto flex items-center justify-center">
        {/* Video/Image Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          autoPlay
          loop
          muted
        >
          <source src="/smart1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#114AB1]/80 to-[#6793AC]/80" />
        {/* Branding */}
        <motion.div
          className="z-10 text-center px-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-5xl font-bold drop-shadow-md">Smart Expense</h1>
          <p className="mt-4 text-lg max-w-sm mx-auto text-white/90">
            Track wisely. Save boldly. Visualize your financial expedition.
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <motion.div
        className="md:w-1/2 w-full bg-[#f4f4f4] p-6 sm:p-10 flex items-center justify-center"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Form Card */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-xl px-8 py-10 text-gray-800">
          <h2 className="text-3xl font-bold text-[#114AB1] mb-6 text-center">
            Create Your Account
          </h2>

         {error && (
  <Typography color="error" align="center" mt={2}>
    {error}
  </Typography>
)}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#114AB1]"
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#114AB1]"
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#114AB1]"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-4 bg-[#114AB1] text-white py-2.5 rounded-xl font-semibold shadow-lg hover:bg-[#0d3b8e] transition-all duration-300"
            >
              Register
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?
            <Link to="/login" className="text-[#E4580B] font-semibold ml-1 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
