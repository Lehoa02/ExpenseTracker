import React from "react";
import { LuArrowRight } from "react-icons/lu";
import ProfitBarChart from "../Charts/ProfitBarChart";

const ProfitSummory = ({ profitByMonth, incomeTransactions, expenseTransactions, onSeeMore }) => {
    return (
        <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h5 className="text-lg">Profit Summary</h5>
                    {/* <p className="text-sm text-gray-500 mt-1">Monthly income vs expense</p> */}
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
            />
        </div>
    )
}

export default ProfitSummory;