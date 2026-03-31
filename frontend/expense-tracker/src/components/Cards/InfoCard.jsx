import React from 'react'
import { addThousandSeparator } from '../../utils/helper';

const InfoCard = ({ icon, label, value, color, isNegative = false }) =>{
    const cardClassName = isNegative
        ? 'flex gap-6 rounded-2xl border border-red-200/80 bg-white p-6 shadow-[0_0_0_1px_rgba(239,68,68,0.18),0_0_30px_rgba(239,68,68,0.35)]'
        : 'flex gap-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50';

    const iconClassName = isNegative
        ? 'w-14 h-14 flex items-center justify-center text-[26px] text-white rounded-full drop-shadow-xl bg-primary'
        : `w-14 h-14 flex items-center justify-center text-[26px] text-white rounded-full drop-shadow-xl ${color}`;

    return <div className={cardClassName}>
        <div className={iconClassName}>
            {icon}
        </div>
        <div>
        <h6 className={`text-sm mb-1  'text-gray-500'`}>{label}</h6>
        <span className={`text-[22px] ${isNegative ? 'font-semibold ' : ''}`}>${addThousandSeparator(value)}</span>
    </div>
    </div>
    
}

export default InfoCard