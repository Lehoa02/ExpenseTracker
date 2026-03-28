import React from 'react'
import { getInitials } from '../../utils/helper';

const CharAvatar = ({ fullName, width, height, style }) => {
    return (
    <div className={`${width || 'w-12'} ${height || 'h-12'} ${style || ''} flex items-center justify-center rounded-full text-gray-900 dark:text-slate-100 font-medium bg-gray-100 dark:bg-slate-700/75`}>
        {getInitials(fullName || "")}
    </div>
    );
};

export default CharAvatar