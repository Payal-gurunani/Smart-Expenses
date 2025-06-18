import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#114AB1] text-white py-6 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} <span className="font-semibold">Smart Expense</span>. All rights reserved.
        </div>
        <div className="flex gap-4 text-sm">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
