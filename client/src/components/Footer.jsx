const Footer = () => {
  return (
    <footer className="bg-[#114AB1] text-white py-4 mt-auto shadow-inner text-center">
      <div className="text-sm">
        © {new Date().getFullYear()} <span className="font-semibold">Smart Expense</span>. 
      </div>
    </footer>
  );
};

export default Footer;
