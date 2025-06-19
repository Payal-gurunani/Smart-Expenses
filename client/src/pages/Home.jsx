import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex flex-col justify-center items-center relative overflow-hidden p-4">
      {/* Background animated circles */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-[#6793AC] rounded-full opacity-30 z-0"
      ></motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#E4580B] rounded-full opacity-20 z-0"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#114AB1] mb-4">
          Welcome to Smart Expense
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          Track, manage, and analyze your expenses with ease. Stay in control of your money.
        </p>
        <button
          onClick={() => navigate("/all-expenses")}
          className="bg-[#E4580B] text-white px-6 py-3 rounded-full hover:bg-[#c54408] transition font-semibold shadow-lg"
        >
          Get Started →
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
