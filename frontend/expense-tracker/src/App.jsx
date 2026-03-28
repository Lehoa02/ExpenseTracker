import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import Settings from './pages/Dashboard/Settings';
import UserProvider from './context/UserContext';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/settings" exact element={<Settings />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: '',
          style: {
            fontSize: '13px'
          },
        }}
        />
      </UserProvider>
    </ThemeProvider>
  )
}

export default App;
const Root = () => {
  //check if token exists in local storage
  const isAuthenticated = !!localStorage.getItem('token');


  //redirect to dashboard if autheticantent otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  )
};