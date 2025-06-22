# 💸 Smart Expense Tracker

A full-featured personal finance tracker built with **React**, **Tailwind CSS**, **Framer Motion**, and **Recharts**. It helps users:

- Add, update, and delete expenses
- View monthly summaries with budget comparisons
- Visualize spending with interactive pie charts
- Track expenses category-wise and by date

---

## 🚀 Features

- ✅ Add, edit, delete individual expenses  
- ✅ Monthly grouping of expenses  
- ✅ Set and update monthly budgets  
- ✅ Pie charts for:
  - Category-wise expense breakdown
  - Spent vs Leftover (if budget is set)  
- ✅ Responsive and animated UI  
- ✅ Expense detail popups with notes and image preview  
- ✅ Toast notifications for actions  
- ✅ Data fetched from backend using `apiRequest` utility  

---

## 🛠 Tech Stack

| Frontend       | Libraries           |
|----------------|---------------------|
| React          | Tailwind CSS        |
| Vite           | Framer Motion       |
| React Router   | Recharts (Charts)   |
| Axios          | React Toastify      |

---

---

## 🔐 Environment Variables Setup

Set up the following `.env` files before running the app:

### 🗄️ Server (`server/.env`)

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```
⚠️ Do not commit this file — it contains sensitive information.

### Client (`client/.env`)
```env
VITE_API_BACKEND_URL=http://localhost:5000
```
---

## 🧩 Install & Run(Fullstack)

```bash
git clone https://github.com/yourusername/smart-expense-tracker.git
cd smart-expense-tracker
# Install root, client, and server dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..

# Start both frontend (Vite) and backend (Express) concurrently
npm start
```
✅ Frontend runs on: http://localhost:5005
✅ Backend runs on: http://localhost:5000


##  Run Individually
▶️ Start Frontend (Vite)
```bash
cd client
npm run dev
```

▶️ Start Backend (Express)
```bash
cd server
npm start

```
---

Thank you for checking out Smart Expense Tracker — built with precision, performance, and passion.







