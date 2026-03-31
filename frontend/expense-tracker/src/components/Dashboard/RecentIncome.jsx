import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment-timezone";
import { getUserTimeZone } from "../../utils/helper";

const RecentIncome = ({ transactions, onSeeMore }) => {

    const incomes = transactions?.filter(t => t.type === "income") || [];
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income</h5>
                <button className="card-btn" onClick={onSeeMore}>See All <LuArrowRight className="text-base"/></button>
            </div>
            <div className="mt-6">
                {incomes?.slice(0,4)?.map((item) => (
                    <TransactionInfoCard
                    key={item._id}
                    title={item.source}
                    icon={item.icon}
                    date={moment.tz(item.date, item.timezone || getUserTimeZone()).format("Do MMM YYYY")}
                    amount={item.amount}
                    type="income"
                    hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    )
};

export default RecentIncome