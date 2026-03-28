import React, { useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "../../utils/helper";

const IncomeOverview = ({ transactions, onAddIncome, onPointClick, onGroupByChange }) => {
    const [chartData, setChartData] = React.useState([]);
    const [groupBy, setGroupBy] = React.useState("day");

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions, groupBy);
        setChartData(result);

        return () => {}
    }, [transactions, groupBy]);

    return (
        <div className="card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h5 className="text-lg">Income Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your earnings over time and analyze your income trends.
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

                    <button className="add-btn" onClick={onAddIncome}>
                        <LuPlus className="text-lg" />
                        Add Income
                    </button>
                </div>
            </div>
            <div className="mt-10">
                <CustomBarChart data={chartData} onPointClick={onPointClick}  />
            </div>
        </div>
    )
}

export default IncomeOverview