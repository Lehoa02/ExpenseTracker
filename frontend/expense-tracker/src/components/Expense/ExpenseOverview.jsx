import React, { useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({
    transactions,
    onAddExpense,
    onPointClick,
    onGroupByChange,
    expenseFilter,
    onClearFilter,
}) => {
    const [chartData, setChartData] = React.useState([]);
    const [groupBy, setGroupBy] = React.useState("7days");

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions, groupBy);
        setChartData(result);

        return () => {}
    }, [transactions, groupBy]);

    return (
        <div className="card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="md:flex-1">
                    <h5 className="text-lg">Expense Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your spensing trends over time and gain insights into your where your money goes.
                    </p>
                </div>
                <div className="flex flex-col items-start gap-3 md:ml-auto md:items-end">
                    <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-slate-700 dark:bg-slate-900/60">
                        <button
                            type="button"
                            onClick={() => {
                                setGroupBy("year");
                                onGroupByChange?.("year");
                            }}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                                groupBy === "year"
                                    ? "bg-[#875cf5] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                            }`}
                        >
                            Years
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setGroupBy("month");
                                onGroupByChange?.("month");
                            }}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                                groupBy === "month"
                                    ? "bg-[#875cf5] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                            }`}
                        >
                            6 Months
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setGroupBy("7days");
                                onGroupByChange?.("7days");
                            }}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                                groupBy === "7days"
                                    ? "bg-[#875cf5] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                            }`}
                        >
                            7 Days
                        </button>
                    </div>

                    <button className="add-btn" onClick={onAddExpense}>
                        <LuPlus className="text-lg" />
                        Add Expense
                    </button>
                </div>
            </div>
            <div className="mt-10">
               <CustomLineChart data={chartData} onPointClick={onPointClick}/>

            </div>
            {expenseFilter && onClearFilter && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClearFilter}
                        className="text-xs font-medium text-[#875cf5] hover:text-[#6d28d9] dark:text-[#a78bfa] dark:hover:text-[#c4b5fd]"
                    >
                        Clear selection
                    </button>
                </div>
            )}
        </div>
    )
}

export default ExpenseOverview