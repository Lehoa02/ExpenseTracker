import React, { useState, useContext }  from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { UserContext } from '../../context/UserContext'
import uploadImage from '../../utils/uploadImage'
import { validateEmail, validatePassword } from '../../utils/helper'
import { useTheme } from '../../context/ThemeContext'

const SignUp = () => {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const { isDark } = useTheme();

  const navigate = useNavigate();

  //Handle Sign Up Form Submition
  const handleSignUp = async (e) =>{
    e.preventDefault();

    let profileImageUrl = "";

    if(!fullName) {
      setError('Please enter your name');
      return;
    };

    if(!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    };

    if(!(password)) {
      setError('Please enter the password');
      return;
    };

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError("");

    //SignUp API logic
    try{

      //Upload imsge if present
      if(profile){
        const imgUploadRes = await uploadImage(profile);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl
      });

      const { token, user } = response.data;

      if(token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };
  


  return (
    <AuthLayout>
      <div className="w-full">
        <div className="auth-card mx-auto w-full max-w-[560px] rounded-[28px] border border-white/60 bg-white/85 p-4 shadow-[0_24px_100px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 sm:p-5">
          <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200">
            Create your account
          </div>

          <h3 className={`mt-3 text-[1.95rem] font-semibold tracking-tight ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
            Set up your profile
          </h3>
          <p className={`mt-2 text-sm leading-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Start with a profile and keep your financial data in one place.
          </p>

        <form onSubmit={handleSignUp} className="mt-4 space-y-3">

          <ProfilePhotoSelector image={profile} setImage={setProfile} />

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              placeholder="Tom Doe"
              label="Full Name"
              type="text"
            />

            <Input 
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="tom@example.com"
              label="Email Address"
              type="text"
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <Input 
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Min 8 chars, mixed case, number, symbol"
              label="Password"
              type="password"
            />
            <Input 
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
              placeholder="Re-enter your password"
              label="Repeat Password"
              type="password"
            />

          </div>

          <p className={`text-xs leading-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.
          </p>
          

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button className="btn-primary" type="submit">
            SIGN UP
          </button>

          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-purple-600 hover:underline">
              Log In
            </Link>
          </p>
        </form>
        </div>
      </div>
    </AuthLayout>
  )
}

export default SignUp