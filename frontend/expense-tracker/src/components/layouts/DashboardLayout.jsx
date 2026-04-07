import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'
import FinanceAssistant from '../AI/FinanceAssistant'


const DashboardLayout = ({children, activeMenu}) => {
    const { user } = useContext(UserContext);
  return (
    <div className=''>
        <Navbar activeMenu={activeMenu} />
        {user && (
            <div className='flex'>
                <div className='max-[1080px]:hidden'>
                    <SideMenu activeMenu={activeMenu} />
                </div>

                <div className='grow mx-5'>{children}</div>
            </div>
        )}
        {user && (
            <div className='max-md:hidden'>
                <FinanceAssistant />
            </div>
        )}
    </div>
   
  );
};

export default DashboardLayout;