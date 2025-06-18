import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../config/apiRequest';
import { endpoints } from '../config/endPoints';
const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiRequest(endpoints.Login, form);
      if (response.message.token) {
        localStorage.setItem('token', response.message.token);
        // navigate('/dashboard'); // ✅ navigate to some protected route
      } else {
        setError('Login failed: No token returned');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col md:flex-row font-[Poppins] text-white">
      {/* Left Side with video background */}
      <div className="relative md:w-1/2 w-full h-[300px] md:h-auto flex items-center justify-center">
        <video
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          autoPlay
          loop
          muted
        >
          <source src="/smart1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#114AB1]/80 to-[#6793AC]/80" />
        <motion.div
          className="z-10 text-center px-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-5xl font-bold drop-shadow-md">Smart Expense</h1>
          <p className="mt-4 text-lg max-w-sm mx-auto text-white/90">
            Login to control your financial future — track and plan smarter.
          </p>
        </motion.div>
      </div>

      {/* Right Panel with form */}
      <motion.div
        className="md:w-1/2 w-full bg-[#f4f4f4] p-6 sm:p-10 flex items-center justify-center"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-xl px-8 py-10 text-gray-800">
          <h2 className="text-3xl font-bold text-[#114AB1] mb-6 text-center">
            Welcome Back
          </h2>

          {error && (
            <p className="text-center text-red-600 font-medium mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
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

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
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
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full mt-4 bg-[#114AB1] text-white py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0d3b8e]'
                }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>

          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?
            <Link to="/register" className="text-[#E4580B] font-semibold ml-1 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
