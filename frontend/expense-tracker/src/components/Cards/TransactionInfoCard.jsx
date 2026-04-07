import React from "react";
import { LuPencilLine, LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2 } from "react-icons/lu";
import { useTheme } from '../../context/ThemeContext';
import { addThousandSeparator } from '../../utils/helper';

const TransactionInfoCard = ({
    title,
    icon,
    date,
    amount,
    type,
    hideDeleteBtn,
    isSelected,
    onSelect,
    onDelete,
    onEdit,
    recurringTemplateId,
    recurrenceStatus,
    recurrenceFrequency,
    onStopRecurring,
    isScheduled,
}) => {
    const { isDark } = useTheme();
    const rowHoverClass = isDark ? 'hover:bg-slate-700/35' : 'hover:bg-gray-100/60';

    const getAmountStyles = () => {
        if (type === "income") {
            return isDark
                ? "bg-emerald-900/40 text-emerald-300"
                : "bg-green-50 text-green-600";
        }

        return isDark
            ? "bg-rose-900/35 text-rose-300"
            : "bg-red-50 text-red-500";
    };
    
    return (
    <div
        role={onSelect ? 'button' : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onClick={onSelect}
        onKeyDown={(event) => {
            if (!onSelect) return;

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect();
            }
        }}
        style={isScheduled ? {
            backgroundImage: isDark 
                ? 'repeating-linear-gradient(45deg, rgba(59, 130, 246, 0.08) 0px, rgba(59, 130, 246, 0.08) 2px, transparent 2px, transparent 15px)'
                : 'repeating-linear-gradient(45deg, rgba(59, 130, 246, 0.12) 0px, rgba(59, 130, 246, 0.12) 2px, transparent 2px, transparent 15px)'
        } : {}}
        className={`group relative flex items-center gap-4 mt-2 p-3 rounded-lg transition-colors duration-150 border ${
            onSelect ? 'cursor-pointer' : ''
        } border-transparent ${isSelected ? (isDark ? 'bg-[#875cf5]/15 ring-1 ring-[#875cf5]/40' : 'bg-[#875cf5]/10 ring-1 ring-[#875cf5]/30') : rowHoverClass}`}
    >
        <div className="w-12 h-12 flex items-center justify-center text-xl text-slate-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700/70 rounded-full">
            {icon ? (
                <img src={icon} alt={title} className="w-6 h-6 opacity-85" />
            ) : (
                <LuUtensils/>
            )}
            </div>   

            <div className="flex-1 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-700 font-medium">{title}</p>
                    <p className="text-xs text-gray-400 mt-1">{date}</p>
                    {isScheduled && (
                        <span className="mt-2 inline-flex rounded-full bg-[#295E9E]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-[#295E9E]/15 dark:text-blue-300">
                            Scheduled
                        </span>
                    )}
                    {(recurringTemplateId || recurrenceFrequency) && recurrenceStatus !== 'stopped' && recurrenceFrequency && (
                        <span className="mt-2 inline-flex rounded-full bg-[#875cf5]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#875cf5] dark:bg-[#875cf5]/15 dark:text-[#a78bfa]">
                            Recurs {recurrenceFrequency}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    

                    {recurringTemplateId && recurrenceStatus !== 'stopped' && onStopRecurring && (
                        <button
                            type="button"
                            className="rounded-full border border-[#875cf5]/25 px-3 py-1.5 text-xs font-medium text-[#875cf5] opacity-0 transition-opacity group-hover:opacity-100 dark:border-[#a78bfa]/30 dark:text-[#c4b5fd]"
                            onClick={onStopRecurring}
                        >
                            Stop sequence
                        </button>
                    )}
                    {onEdit && (
                        <button
                            type="button"
                            className="text-gray-400 hover:text-[#f5cc5c] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={(event) => {
                                event.stopPropagation();
                                onEdit?.({
                                    title,
                                    icon,
                                    date,
                                    amount,
                                    type,
                                    recurringTemplateId,
                                    recurrenceStatus,
                                    recurrenceFrequency,
                                });
                            }}
                        >
                            <LuPencilLine size={18} />
                        </button>
                    )}

                    {!hideDeleteBtn && (
                        <button
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete?.({
                                    title,
                                    icon,
                                    date,
                                    amount,
                                    type,
                                    recurringTemplateId,
                                    recurrenceStatus,
                                    recurrenceFrequency,
                                });
                            }}
                        >
                            <LuTrash2 size={18} />
                        </button>
                    )}

                    <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}>
                        <h6 className="text-xs font-medium">
                            {type === "income" ? "+" : "-"} {addThousandSeparator(amount)}
                        </h6>
                        {type === "income" ? <LuTrendingUp/> : <LuTrendingDown/>}
                    </div>

                </div>
        </div>
    </div>
    );
}

export default TransactionInfoCard;