import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

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

    // Login to API call
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">Please enter your details to log in</p>

        {/* Login and Password Inputs + Buttons */}
        <form onSubmit={handleLogin}>
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

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button className="btn-primary" type="submit">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
};

export default Login