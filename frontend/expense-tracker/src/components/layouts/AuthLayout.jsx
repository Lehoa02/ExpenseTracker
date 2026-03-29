import React from 'react'
import CARD_2 from "../../assets/images/temp.jpeg"
import { LuTrendingUpDown } from "react-icons/lu"
import { addThousandSeparator } from '../../utils/helper';
import { useTheme } from '../../context/ThemeContext'
import ThemeToggleButton from './ThemeToggleButton'

const AuthLayout = ({children}) => {
  const { isDark } = useTheme();

  const rightPanelClassName = isDark
    ? 'hidden md:block w-[40vw] h-screen overflow-hidden p-8 relative bg-slate-950'
    : 'hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative';

  const rightPanelOverlayClassName = isDark
    ? 'absolute inset-0 bg-slate-950/90'
    : 'absolute inset-0 bg-violet-50/80';

  const statsCardClassName = isDark
    ? 'flex gap-6 bg-slate-900/90 p-4 rounded-xl shadow-md shadow-black/30 border border-slate-700/80 z-10 backdrop-blur-sm'
    : 'flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-grey-200/50 z-10';

  const statsLabelClassName = isDark ? 'text-xs text-slate-300 mb-1' : 'text-xs text-gray-500 mb-1';
  const statsValueClassName = isDark ? 'text-[20px] text-slate-100' : 'text-[20px]';

  return (
    <div className="flex min-h-screen">
        <div className="w-screen h-screen md:w-[60vw] px-6 sm:px-10 lg:px-12 pt-8 pb-12 bg-white dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium text-black dark:text-slate-100">Expense Tracker</h2>
              <ThemeToggleButton className="theme-toggle-icon-only ml-auto text-gray-700 hover:text-gray-500 dark:text-slate-200 dark:hover:text-sky-400" iconClassName="text-lg" />
            </div>
            {children}
        </div>
        
        {/* right section */}
        <div className={rightPanelClassName}>
          <div className={rightPanelOverlayClassName} />
          {/* decoration - rectangles */}
            <div className={isDark ? 'w-48 h-48 rounded-[40px] bg-violet-950/80 absolute -top-7 -left-5' : 'w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5'} />
            <div className={isDark ? 'w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-500/30 absolute top-[30%] -right-10' : 'w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10'} />
            <div className={isDark ? 'w-48 h-48 rounded-[40px] bg-indigo-950/85 absolute -bottom-7 -left-5' : 'w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5'} />

            {/* top section */}
            <div className="relative z-20 grid grid-cols-1">
              {/* set up down there */}
              <StatsInfoCard
                icon={<LuTrendingUpDown />}
                label="Track Your Income & Expenses"
                value="430,000"
                color="bg-primary"
                cardClassName={statsCardClassName}
                labelClassName={statsLabelClassName}
                valueClassName={statsValueClassName}
              />
              </div>

            {/* info graphic */}
            <img
            src={CARD_2}
            className={isDark ? 'w-64 lg:w-[90%] absolute bottom-10 z-20 shadow-lg shadow-black/40' : 'w-64 lg:w-[90%] absolute bottom-10 z-20 shadow-lg shadow-blue-400/15'}
            alt="Expense tracker preview"
            />
        </div>
    </div>
  )
};

export default AuthLayout

const StatsInfoCard = ({icon, label, value, color, cardClassName, labelClassName, valueClassName}) => {
  return <div className={cardClassName}>
  <div
  className={'w-12 h-12 flex items-center justify-center text-[26px] text-white ' + color + ' rounded-full drop-shadow-xl'}>
      {icon}
    </div>
    <div>
      <h6 className={labelClassName}>{label}</h6>
      <span className={valueClassName}>${addThousandSeparator(value)}</span>
    </div>  
    </div>
}