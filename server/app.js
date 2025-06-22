import express from 'express'
import cookieParser from 'cookie-parser';
import userRoutes from './components/routes/user.routes.js'
import expenseRoutes from './components/routes/expense.routes.js'
import budgetRoutes from './components/routes/budget.routes.js'
import cors from 'cors'
const app = express();
app.use(express.json())
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5005",                 // Vite dev server
  "https://smart-expenses-two.vercel.app"       // Vercel deployed app
];
app.use(cors({
  origin: allowedOrigins, // Allow your frontend origin
  credentials: true                // If you're using cookies or auth headers
}));

app.use('/api/v1/users',userRoutes)
app.use('/api/v1/expenses',expenseRoutes)
app.use('/api/v1/budget',budgetRoutes)
// Global Error Handler
app.use((err, req, res, next) => {

  // If error is an instance of your custom ApiError
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
});

export {app}