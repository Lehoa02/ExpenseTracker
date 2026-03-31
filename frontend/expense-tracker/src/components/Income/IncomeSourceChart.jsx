import React, { useMemo } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { addThousandSeparator, prepareIncomeCategoryChartData } from '../../utils/helper';

const IncomeSourceChart = ({
    transactions,
    selectedSource,
    onSourceSelect,
    onClearSource,
    onDeleteSource,
}) => {
    const categoryData = useMemo(() => prepareIncomeCategoryChartData(transactions), [transactions]);

    const totalAmount = useMemo(
        () => categoryData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
        [categoryData]
    );

    return (
        <div className="card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                    <h5 className="text-lg">Income by Source</h5>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Pick a source to compare its total against the selected income period.
                    </p>
                </div>
                <div className="w-full max-w-full md:w-auto md:max-w-[18rem]">
                    <div className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 md:text-xs">
                        Total Income: <span className="font-bold text-gray-900 dark:text-slate-50">${addThousandSeparator(totalAmount)}</span>
                    </div>
                </div>
            </div>

            {categoryData.length > 0 ? (
                <div className="mt-5 space-y-3">
                    <div className="h-[22rem] space-y-3 overflow-y-auto pr-1">
                        {categoryData.map((item) => {
                            const percent = totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0;
                            const percentLabel = item.amount > 0 && percent === 0 ? '<1' : percent;
                            const isActive = selectedSource === item.name;

                            return (
                                <div
                                    key={item.name}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onSourceSelect?.(item.name)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            onSourceSelect?.(item.name);
                                        }
                                    }}
                                    className={`group w-full cursor-pointer rounded-2xl border px-4 py-3 text-left transition-all ${
                                        isActive
                                            ? 'border-[#875cf5] bg-[#875cf5]/10 shadow-sm dark:border-[#a78bfa] dark:bg-[#875cf5]/15'
                                            : 'border-gray-200 bg-white hover:border-[#875cf5]/40 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                                {item.name}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                                                {percentLabel}% of total income
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    onDeleteSource?.(item.name);
                                                }}
                                                className="opacity-0 transition-opacity group-hover:opacity-100 text-gray-400 hover:text-red-500"
                                                title={`Delete ${item.name}`}
                                                aria-label={`Delete ${item.name}`}
                                            >
                                                <LuTrash2 className="text-base" />
                                            </button>

                                            <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                                ${addThousandSeparator(item.amount)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                                        <div
                                            className="h-full rounded-full bg-[#875cf5] transition-all dark:bg-[#a78bfa]"
                                            style={{ width: `${Math.max(percent, 4)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedSource && onClearSource && (
                        <div className="flex justify-end pt-1">
                            <button
                                type="button"
                                onClick={onClearSource}
                                className="text-xs font-medium text-[#875cf5] hover:text-[#6d28d9] dark:text-[#a78bfa] dark:hover:text-[#c4b5fd]"
                            >
                                Clear selection
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                    Add a few income entries to see the source breakdown.
                </div>
            )}
        </div>
    );
};

export default IncomeSourceChart;