import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from 'moment';

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
    // Filter to show only expenses
    const expenses = transactions?.filter(t => t.type === "expense") || [];

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Expenses</h5>

                <button className='card-btn' onClick={onSeeMore}>See All <LuArrowRight className='text-base' /></button>
            </div>

            <div className=''>
                {expenses?.slice(0,4).map((expense) => (
                    <TransactionInfoCard
                    key={expense._id}
                    title={expense.category}
                    icon={expense.icon}
                    date={moment.utc(expense.date).format("Do MMM YYYY")}
                    amount={expense.amount}
                    type="expense"
                    hideDeleteBtn
                    />
                ))}
                
            </div>
        </div>
    )
}

export default ExpenseTransactions