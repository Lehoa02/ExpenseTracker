import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'


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
    </div>
   
  );
};

export default DashboardLayout;


{/*
import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'


const DashboardLayout = ({children, activeMenu}) => {
    const { user } = useContext(UserContext);
    const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className=''>
        <Navbar activeMenu={activeMenu} openSideMenu={openSideMenu} setOpenSideMenu={setOpenSideMenu} />
        {user && (
            <div className='flex'>
                <div className='max-[1080px]:hidden'>
                    <SideMenu activeMenu={activeMenu} />
                </div>

                <div className={`grow mx-5 transition-all duration-200 ${openSideMenu ? 'max-[1080px]:ml-64' : ''}`}>
                  {children}
                </div>
            </div>
        )}
    </div>

  )
}

export default DashboardLayout */}