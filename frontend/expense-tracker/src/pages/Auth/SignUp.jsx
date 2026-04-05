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

const SignUp = () => {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

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
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">Please enter your details to create an account</p>

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profile} setImage={setProfile} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="col-span-2">
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

          </div>

          <p className="mt-3 text-xs text-slate-600">
            Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.
          </p>
          

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button className="btn-primary" type="submit">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp