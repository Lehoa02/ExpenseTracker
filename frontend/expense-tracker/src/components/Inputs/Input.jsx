import React from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({value, onChange, placeholder, label, type}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

  return (
    <div>
      <label className='text-[13px] text-state-800'>{label}</label>

      <div className='input-box'>
      <input
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        value={value}
        className="w-full bg-tranparent outline-none"
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
      />

        {type === 'password' && (
            <>
                {showPassword ? (
                    <FaRegEye
                    size={22}
                    className='text-primary cursor-pointer'
                    onClick={() => toggleShowPassword()}
                    />
                ) : (
                    <FaRegEyeSlash
                    size={22}
                    className='text-slate-400 cursor-pointer'
                    onClick={() => toggleShowPassword()}
                    />
                )}
            </>
        )}
      </div>
    </div>
  )
}

export default Input