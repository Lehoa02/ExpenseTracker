import React, { useEffect, useMemo, useState } from "react";
import { LuDownload, LuTrash2, LuX } from "react-icons/lu";
import moment from "moment-timezone";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { getUserTimeZone } from "../../utils/helper";

const IncomeList = ({
    transactions,
    onDelete,
    onEdit,
    onBulkDeleteRequest,
    onDownload,
    filterLabel,
    sourceLabel,
    onClearFilters,
    onStopRecurring,
}) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const visibleIds = useMemo(() => (transactions || []).map((income) => income._id), [transactions]);

    useEffect(() => {
        setSelectedIds((currentIds) => currentIds.filter((id) => visibleIds.includes(id)));
    }, [visibleIds]);

    const toggleSelected = (id) => {
        setSelectedIds((currentIds) =>
            currentIds.includes(id) ? currentIds.filter((item) => item !== id) : [...currentIds, id]
        );
    };

    const handleBulkDeleteClick = () => {
        if (!onBulkDeleteRequest || selectedIds.length === 0) return;

        const selectedItems = (transactions || []).filter((income) => selectedIds.includes(income._id));
        onBulkDeleteRequest(selectedItems);
    };

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
                    {selectedIds.length > 0 && onBulkDeleteRequest && (
                        <button
                            type="button"
                            className="card-btn px-3 text-red-600 hover:text-red-700"
                            onClick={handleBulkDeleteClick}
                            title={`Delete selected (${selectedIds.length})`}
                            aria-label={`Delete selected (${selectedIds.length})`}
                        >
                            <LuTrash2 className="text-base" />
                        </button>
                    )}

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
                        date={moment.tz(income.date, income.timezone || getUserTimeZone()).format("Do MMM, YYYY")}
                        amount={income.amount}
                        type="income"
                        isSelected={selectedIds.includes(income._id)}
                        isScheduled={income.isScheduled}
                        onSelect={() => toggleSelected(income._id)}
                        onDelete={() => onDelete(income)}
                        onEdit={() => onEdit?.(income)}
                        recurringTemplateId={income.recurringTemplateId}
                        recurrenceStatus={income.recurrenceStatus}
                        recurrenceFrequency={income.recurrenceFrequency}
                        onStopRecurring={income.recurringTemplateId ? () => onStopRecurring(income.recurringTemplateId) : undefined}
                    />
                ))}
            </div>
        </div>
    )
}

export default IncomeList