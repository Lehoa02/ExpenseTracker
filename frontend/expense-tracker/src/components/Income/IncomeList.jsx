import React from "react";
import { LuDownload, LuX } from "react-icons/lu";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const IncomeList = ({
    transactions,
    onDelete,
    onDownload,
    filterLabel,
    sourceLabel,
    onClearFilters,
}) => {
    return (
        <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                <h5 className="text-lg">Income Sources</h5>
                {filterLabel && (
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                        Filtered for <span className="font-semibold text-gray-800 dark:text-slate-100">{filterLabel}</span>
                    </span>               
            )}
                {sourceLabel && (
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                        {filterLabel ? '•' : 'Filtered for'} <span className="font-semibold text-gray-800 dark:text-slate-100">{sourceLabel}</span>
                    </span>
                )}
            </div>
                </div>

                <div className="flex items-center gap-2">
                    {(filterLabel || sourceLabel) && onClearFilters && (
                        <button
                            type="button"
                            className="card-btn px-3"
                            onClick={onClearFilters}
                            title="Clear filters"
                            aria-label="Clear filters"
                        >
                            <LuX className="text-base" />
                        </button>
                    )}

                <button className="card-btn" onClick={onDownload}>
                    <LuDownload className="text-base"/>
                    Download
                </button>
            </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
                {transactions?.map((income) => (
                    <TransactionInfoCard 
                        key={income._id}
                        title={income.source}
                        icon={income.icon}
                        date={moment.utc(income.date).format("Do MMM, YYYY")}
                        amount={income.amount}
                        type="income"
                        onDelete={() => onDelete(income._id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default IncomeList