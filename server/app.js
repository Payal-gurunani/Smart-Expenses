import express from 'express'
import cookieParser from 'cookie-parser';
import userRoutes from './components/routes/user.routes.js'
import expenseRoutes from './components/routes/expense.routes.js'

const app = express();
app.use(express.json())
app.use(cookieParser());
app.use('/api/v1/users',userRoutes)

app.use('/api/v1/expenses',expenseRoutes)
export {app}