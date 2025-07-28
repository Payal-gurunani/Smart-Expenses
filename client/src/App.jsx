import './App.css'
import { ToastContainer } from 'react-toastify';
import { Routes,Route } from 'react-router-dom'
import Layout from './Layout'
import Register from './authentication/Register';
import Login from './authentication/Login';
import CreateExpense from './pages/CreateExpense';
import AllExpenses from './pages/expenses/Allexpenses';
import UpdateExpense from './pages/UpdateExpense';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoutes';
function App() {
  return (
    <div className={` flex flex-col  min-h-screen `}>
       <Routes>
      <Route path='/' element = {<Layout />}>
      <Route index element = {<Home />}/>
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />}/>
     
      <Route path='create-expense' element={
            <ProtectedRoute><CreateExpense /></ProtectedRoute>
          } />
          <Route path='all-expenses' element={
            <ProtectedRoute><AllExpenses /></ProtectedRoute>
          } />
          <Route path='update-expense/:id' element={
            <ProtectedRoute><UpdateExpense /></ProtectedRoute>
          } />
      </Route>
    </Routes>
          <ToastContainer position="top-right" autoClose={3000} />

    </div>

  )
}

export default App
