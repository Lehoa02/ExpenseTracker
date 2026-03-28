import React, { useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions, onAddExpense, onPointClick, onGroupByChange }) => {
    const [chartData, setChartData] = React.useState([]);
    const [groupBy, setGroupBy] = React.useState("day");

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions, groupBy);
        setChartData(result);

        return () => {}
    }, [transactions, groupBy]);

    return (
        <div className="card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h5 className="text-lg">Expense Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your spensing trends over time and gain insights into your where your money goes.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
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
                            Months
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setGroupBy("day");
                                onGroupByChange?.("day");
                            }}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                                groupBy === "day"
                                    ? "bg-[#875cf5] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                            }`}
                        >
                            Days
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
        </div>
    )
}

export default ExpenseOverview