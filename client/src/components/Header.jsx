import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../config/apiRequest';
import { endpoints } from '../config/endPoints';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx'; // ✅

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth(); // ✅ using context

  const handleLogout = async () => {
    try {
      await apiRequest(endpoints.Logout);
      toast.success("User logged out");
    } catch (err) {
      toast.error("Logout failed");
      console.error('Logout error:', err.message);
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false); // ✅ update global state
      navigate('/login');
    }
  };

  return (
    <header className="bg-[#114AB1] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">Smart Expense</Link>
      
      <nav className="flex gap-4">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <button 
            onClick={handleLogout} 
            className="bg-[#E4580B] px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
