import React, { useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "../../utils/helper";

const IncomeOverview = ({
    transactions,
    onAddIncome,
    onPointClick,
    onGroupByChange,
    incomeFilter,
    onClearFilter,
}) => {
    const [chartData, setChartData] = React.useState([]);
    const [groupBy, setGroupBy] = React.useState("30days");

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions, groupBy);
        setChartData(result);

        return () => {}
    }, [transactions, groupBy]);

    return (
        <div className="card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="md:flex-1">
                    <h5 className="text-lg">Income Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your earnings over time and analyze your income trends.
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
                            Months
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setGroupBy("30days");
                                onGroupByChange?.("30days");
                            }}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                                groupBy === "30days"
                                    ? "bg-[#875cf5] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                            }`}
                        >
                            30 Days
                        </button>
                    </div>

                    <button className="add-btn" onClick={onAddIncome}>
                        <LuPlus className="text-lg" />
                        Add Income
                    </button>
                </div>
            </div>
            <div className="mt-10">
                <CustomBarChart
                    data={chartData}
                    onPointClick={onPointClick}
                    selectedPointKey={incomeFilter?.bucketKey}
                />
            </div>
            {incomeFilter && onClearFilter && (
                <div className=" flex justify-end">
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

export default IncomeOverview