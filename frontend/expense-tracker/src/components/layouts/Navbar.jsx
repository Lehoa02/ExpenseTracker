import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { LuMoon, LuSun } from 'react-icons/lu';
import SideMenu from './SideMenu';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ activeMenu }) => {
    const [ openSideMenu, setOpenSideMenu ] = useState(false);
        const { isDark, toggleTheme } = useTheme();
  return (
    <div className='flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4  px-7 sticky top-0 z-50'>
        <button
            className='block lg:hidden text-black'
            onClick={() => {
                setOpenSideMenu(!openSideMenu);}
            }
        >
            {openSideMenu ? (
                <HiOutlineX className='text-2xl' /> 
            ) : (
                <HiOutlineMenu className='text-2xl' />
)}
        </button>

        <h2 className='text-lg font-medium text-black'> Expense Tracker</h2>

        <button
            className='theme-toggle-icon-only ml-auto text-gray-800 hover:text-gray-600 dark:text-slate-200 dark:hover:text-sky-400'
            onClick={toggleTheme}
            aria-label='Toggle theme'
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? <LuSun className='text-lg' /> : <LuMoon className='text-lg' />}
        </button>

        {openSideMenu && (
            <div className='fixed top-[61px] -ml-4 bg-white'> {/*z-40 */}
                <SideMenu activeMenu={activeMenu} />
            </div>
        )}

    </div>

  )
}

export default Navbar