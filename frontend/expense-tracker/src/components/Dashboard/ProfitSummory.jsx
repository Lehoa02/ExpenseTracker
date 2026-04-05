import React, { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import ProfitBarChart from "../Charts/ProfitBarChart";
import Modal from "../Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { addThousandSeparator } from "../../utils/helper";

const ProfitSummory = ({ profitByMonth, incomeTransactions, expenseTransactions, onSeeMore }) => {
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [monthlyBreakdown, setMonthlyBreakdown] = useState(null);
    const [loadingBreakdown, setLoadingBreakdown] = useState(false);
    const [breakdownError, setBreakdownError] = useState("");

    const handleMonthClick = async (monthData) => {
        if (!monthData?.bucketKey) {
            return;
        }

        setSelectedMonth(monthData);
        setMonthlyBreakdown(null);
        setBreakdownError("");
        setLoadingBreakdown(true);

        try {
            const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_PROFIT_BREAKDOWN(monthData.bucketKey));
            setMonthlyBreakdown(response.data || null);
        } catch (error) {
            console.error("Failed to load monthly breakdown:", error);
            setBreakdownError("We could not load the weekly breakdown for this month.");
        } finally {
            setLoadingBreakdown(false);
        }
    };

    const closeBreakdown = () => {
        setSelectedMonth(null);
        setMonthlyBreakdown(null);
        setBreakdownError("");
        setLoadingBreakdown(false);
    };

    return (
        <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h5 className="text-lg">Profit Summary</h5>
                    <p className="mt-1 text-sm text-gray-500">Click any month to inspect the weekly breakdown.</p>
                </div>

                {onSeeMore && (
                    <button onClick={onSeeMore} className="card-btn">
                        View More <LuArrowRight className="text-base" />
                    </button>
                )}
            </div>

            <ProfitBarChart
                data={profitByMonth}
                incomeTransactions={incomeTransactions}
                expenseTransactions={expenseTransactions}
                onMonthClick={handleMonthClick}
            />

            <Modal
                isOpen={Boolean(selectedMonth)}
                onClose={closeBreakdown}
                title={monthlyBreakdown?.monthLabel || selectedMonth?.month || "Monthly Breakdown"}
            >
                {loadingBreakdown ? (
                    <div className="py-8 text-center text-sm text-gray-500">Loading weekly breakdown...</div>
                ) : breakdownError ? (
                    <div className="py-8 text-center text-sm text-red-500">{breakdownError}</div>
                ) : monthlyBreakdown ? (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="text-xs uppercase tracking-wide text-gray-500">Income</p>
                                <p className="mt-2 text-lg font-semibold text-gray-900">${addThousandSeparator(monthlyBreakdown?.totals?.income || 0)}</p>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="text-xs uppercase tracking-wide text-gray-500">Expense</p>
                                <p className="mt-2 text-lg font-semibold text-gray-900">${addThousandSeparator(monthlyBreakdown?.totals?.expense || 0)}</p>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="text-xs uppercase tracking-wide text-gray-500">Profit</p>
                                <p className={`mt-2 text-lg font-semibold ${Number(monthlyBreakdown?.totals?.profit || 0) < 0 ? "text-red-500" : "text-emerald-600"}`}>
                                    ${addThousandSeparator(monthlyBreakdown?.totals?.profit || 0)}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Week</th>
                                        <th className="px-4 py-3 font-medium">Date range</th>
                                        <th className="px-4 py-3 font-medium">Income</th>
                                        <th className="px-4 py-3 font-medium">Expense</th>
                                        <th className="px-4 py-3 font-medium">Profit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {(monthlyBreakdown?.weeks || []).map((week) => {
                                        const profit = Number(week?.profit || 0);

                                        return (
                                            <tr key={week.weekKey}>
                                                <td className="px-4 py-3 font-medium text-gray-900">{week.weekLabel}</td>
                                                <td className="px-4 py-3 text-gray-600">{week.rangeLabel}</td>
                                                <td className="px-4 py-3 text-gray-700">${addThousandSeparator(week.income || 0)}</td>
                                                <td className="px-4 py-3 text-gray-700">${addThousandSeparator(week.expense || 0)}</td>
                                                <td className={`px-4 py-3 font-medium ${profit < 0 ? "text-red-500" : "text-emerald-600"}`}>
                                                    ${addThousandSeparator(profit)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    )
}

export default ProfitSummory;