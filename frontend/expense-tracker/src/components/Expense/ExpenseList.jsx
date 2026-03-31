import React from "react";
import { LuDownload, LuX } from "react-icons/lu";
import moment from "moment-timezone";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { getUserTimeZone } from "../../utils/helper";

const ExpenseList = ({ transactions, onDelete, onDownload, filterLabel, categoryLabel, onClearFilter, onStopRecurring }) => {
    const hasPreviousLabel = Boolean(filterLabel);

    return (
        <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="text-lg">All Expenses</h5>
                        {filterLabel && (
                            <span className="text-sm text-gray-500 dark:text-slate-400">
                                {hasPreviousLabel ? '•' : 'filtered for'} <span className="font-semibold text-gray-800 dark:text-slate-100">{filterLabel}</span>
                            </span>
                        )}
                        {categoryLabel && (
                            <span className="text-sm text-gray-500 dark:text-slate-400">
                                {hasPreviousLabel || filterLabel ? '•' : 'filtered for'} <span className="font-semibold text-gray-800 dark:text-slate-100">{categoryLabel}</span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {filterLabel && onClearFilter && (
                        <button
                            type="button"
                            className="card-btn px-3"
                            onClick={onClearFilter}
                            title="Clear filter"
                            aria-label="Clear filter"
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
                {transactions?.map((expense) => (
                    <TransactionInfoCard 
                        key={expense._id}
                        title={expense.category}
                        icon={expense.icon}
                        date={moment.tz(expense.date, expense.timezone || getUserTimeZone()).format("Do MMM, YYYY")}
                        amount={expense.amount}
                        type="expense"
                        onDelete={() => onDelete(expense._id)}
                        recurringTemplateId={expense.recurringTemplateId}
                        recurrenceStatus={expense.recurrenceStatus}
                        recurrenceFrequency={expense.recurrenceFrequency}
                        onStopRecurring={expense.recurringTemplateId ? () => onStopRecurring(expense.recurringTemplateId) : undefined}
                    />
                ))}
            </div>
        </div>
    )
}

export default ExpenseList