import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import SideMenu from './SideMenu';
import ThemeToggleButton from './ThemeToggleButton';

const Navbar = ({ activeMenu }) => {
    const [ openSideMenu, setOpenSideMenu ] = useState(false);
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

        <ThemeToggleButton className='theme-toggle-icon-only ml-auto text-gray-800 cursor-pointer hover:text-gray-600 dark:text-slate-200 dark:hover:text-sky-400' iconClassName='text-lg' />

        {openSideMenu && (
            <div className='fixed top-[61px] -ml-4 bg-white'> {/*z-40 */}
                <SideMenu activeMenu={activeMenu} />
            </div>
        )}

    </div>

  )
}

export default Navbar