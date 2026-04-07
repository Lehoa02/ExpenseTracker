import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { UserContext } from '../../context/UserContext'
import { useTheme } from '../../context/ThemeContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { updateUser } = useContext(UserContext);
  const { isDark } = useTheme()

  const navigate = useNavigate();

  //handle login form submit
  //+ validate email and password
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if(!(password)) {
      setError('Please enter the password');
      return;
    }

    setError("");
    setIsLoading(true);

    // Login to API call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });
      const { token } = response.data;

      if(token) {
        localStorage.setItem('token', token);
        updateUser(response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="auth-card mx-auto w-full max-w-[500px] rounded-[28px] border border-white/60 bg-white/85 p-4 shadow-[0_24px_100px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/92 dark:shadow-[0_24px_100px_rgba(2,6,23,0.55)] sm:p-5">
          <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200">
            Welcome back
          </div>

          <h3 className={`mt-3 text-2xl font-semibold tracking-tight sm:text-[2rem] ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
            Sign in to continue
          </h3>
          <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Use the same account you track expenses and income with.
          </p>

          <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
          <Input 
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          placeholder="tom@example.com"
          label="Email Address"
          type="text"
          />

          <Input 
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Min 8 Characters"
          label="Password"
          type="password"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            className="btn-primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </button>

          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:text-purple-600 hover:underline">
              Sign Up
            </Link>
          </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
};

export default Login