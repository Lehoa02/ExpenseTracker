import React, { useState }  from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'

const SignUp = () => {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

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

    setError("");

    //SignUp API logic

  }
  


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
              placeholder="Min 8 Characters"
              label="Password"
              type="password"
            />
            </div>

          </div>
          

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