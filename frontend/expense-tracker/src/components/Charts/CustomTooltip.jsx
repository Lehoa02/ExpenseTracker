import React from 'react'
import { addThousandSeparator } from '../../utils/helper';

const CustomTooltip = ({ active, payload, isDark }) => {
    if (active && payload && payload.length) {
       return (
        <div className={`shadow-md rounded-lg p-2 border ${isDark ? 'bg-gray-800 border-slate-600' : 'bg-white border-gray-300'}`}>
            <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-violet-300' : 'text-purple-800'}`}>{payload[0].name}</p>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Amount: <span className={`text-sm font-medium ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>${addThousandSeparator(payload[0].value)}</span>
            </p>
        </div>
       );
    }   
    return null;
}

export default CustomTooltip