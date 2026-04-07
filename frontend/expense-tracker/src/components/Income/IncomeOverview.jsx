import React, { useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "../../utils/helper";

const IncomeOverview = ({
    transactions,
    onAddIncome,
    onPointClick,
    onGroupByChange,
    selectedGroupBy,
    incomeFilter,
    onClearFilter,
}) => {
    const [chartData, setChartData] = React.useState([]);
    const [groupBy, setGroupBy] = React.useState("30days");
    const activeGroupBy = selectedGroupBy || groupBy;

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions, activeGroupBy);
        setChartData(result);

        return () => {}
    }, [transactions, activeGroupBy]);

    return (
        <div className="card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="md:flex-1">
                    <h5 className="text-lg">Income Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your earnings over time and analyze your income trends.
                    </p>
                </div>
                <div className="flex w-full flex-col items-start gap-3 md:ml-auto md:w-auto md:items-end">
                    <div className="flex w-fit flex-wrap items-center justify-start gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-slate-700 dark:bg-slate-900/60 md:w-auto md:flex-nowrap md:rounded-full">
                        <button
                            type="button"
                            onClick={() => {
                                setGroupBy("year");
                                onGroupByChange?.("year");
                            }}
                            className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors md:px-4 md:text-xs ${
                                activeGroupBy === "year"
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
                            className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors md:px-4 md:text-xs ${
                                activeGroupBy === "month"
                                    ? "bg-[#875cf5] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                            }`}
                        >
                            6 Months
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setGroupBy("30days");
                                onGroupByChange?.("30days");
                            }}
                            className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors md:px-4 md:text-xs ${
                                activeGroupBy === "30days"
                                    ? "bg-[#875cf5] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                            }`}
                        >
                            30 Days
                        </button>
                    </div>

                    <button className="add-btn w-fit justify-center self-start px-6 md:w-auto md:self-auto md:px-4" onClick={onAddIncome}>
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