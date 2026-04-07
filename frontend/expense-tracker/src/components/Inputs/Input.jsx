import React from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useTheme } from '../../context/ThemeContext'

const Input = ({value, onChange, placeholder, label, type}) => {
    const [showPassword, setShowPassword] = React.useState(false);
  const { isDark } = useTheme();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

  return (
    <div className="space-y-2">
      <label className={`text-[13px] font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{label}</label>

      <div className='input-box'>
      <input
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        value={value}
        className={`w-full bg-transparent outline-none ${isDark ? 'placeholder:text-slate-500' : 'placeholder:text-slate-400'}`}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
      />

        {type === 'password' && (
            <>
                {showPassword ? (
                    <FaRegEye
                    size={22}
                    className='cursor-pointer text-primary'
                    onClick={() => toggleShowPassword()}
                    />
                ) : (
                    <FaRegEyeSlash
                    size={22}
                    className={`cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-400'}`}
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