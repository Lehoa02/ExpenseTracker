import React, { useMemo, useState } from "react";
import moment from "moment-timezone";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import { getUserTimeZone } from "../../utils/helper";

const AddIncomeForm = ({ onAddIncome, recentTransactions = [] }) => {
    const [income, setIncome] = useState({
        amount: '',
        source: '',
        date: '',
        icon: '',
        isRecurring: false,
        frequency: 'monthly',
    });

    const recentIncomeTemplates = useMemo(
        () =>
            Array.from(
                [...recentTransactions]
                    .filter((item) => item?.source)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .reduce((templates, item) => {
                        const sourceKey = item.source.trim().toLowerCase();

                        if (!templates.has(sourceKey)) {
                            templates.set(sourceKey, item);
                        }

                        return templates;
                    }, new Map())
                    .values()
            ).slice(0, 5),
        [recentTransactions]
    );

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });

    const handleUseTemplate = (transaction) => {
        setIncome({
            amount: transaction?.amount ?? '',
            source: transaction?.source ?? '',
            date: moment().format('YYYY-MM-DD'),
            icon: transaction?.icon ?? '',
            isRecurring: false,
            frequency: 'monthly',
        });
    };

    return (
        <div className="space-y-6">

            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h6 className="text-sm font-medium text-gray-900 dark:text-slate-100">Recent income</h6>
                        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                            Click one to reuse the same source and amount.
                        </p>
                    </div>
                </div>

                {recentIncomeTemplates.length > 0 ? (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {recentIncomeTemplates.map((transaction) => (
                            <button
                                key={transaction._id}
                                type="button"
                                onClick={() => handleUseTemplate(transaction)}
                                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left transition-colors hover:border-[#875cf5]/40 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950/60 dark:hover:bg-slate-900"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#875cf5]/10 text-sm font-semibold text-[#875cf5] dark:bg-[#875cf5]/15 dark:text-[#a78bfa]">
                                    {transaction?.icon ? (
                                        <img src={transaction.icon} alt={transaction.source} className="h-5 w-5" />
                                    ) : (
                                        transaction?.source?.[0]?.toUpperCase() || 'I'
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium text-gray-900 dark:text-slate-100">
                                        {transaction.source}
                                    </div>
                                    <div className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                                        ${transaction.amount} · {moment.tz(transaction.date, transaction.timezone || getUserTimeZone()).format('Do MMM YYYY')}
                                    </div>
                                </div>

                                <div className="text-xs font-medium text-[#875cf5] dark:text-[#a78bfa]">
                                    Use
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400">
                        Your recent income entries will appear here after you add a few transactions.
                    </div>
                )}
            </div>

            <EmojiPickerPopup 
            icon={income.icon}
            onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />

            <Input 
            value={income.source}
            onChange={({target}) => handleChange('source', target.value)}
            placeholder="Freelance, Salary, etc."
            label="Income Source"
            type="text"
            />

            <Input 
            value={income.amount}
            onChange={({target}) => handleChange('amount', target.value)}
            placeholder=""
            label="Amount"
            type="number"
            />

            <Input 
            value={income.date}
            onChange={({target}) => handleChange('date', target.value)}
            placeholder=""
            label="Date"
            type="date"
            />

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                <label className="flex items-center gap-3 text-sm font-medium text-gray-900 dark:text-slate-100">
                    <input
                        type="checkbox"
                        checked={income.isRecurring}
                        onChange={({ target }) => handleChange('isRecurring', target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#875cf5] focus:ring-[#875cf5]"
                    />
                    Repeat this income automatically
                </label>

                {income.isRecurring && (
                    <div className="mt-4">
                        <label className="mb-2 block text-sm text-gray-700 dark:text-slate-300">Repeat every</label>
                        <select
                            value={income.frequency}
                            onChange={({ target }) => handleChange('frequency', target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#875cf5] dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-6">
                <button
                type="button"
                className="add-btn add-btn-fill"
                onClick={() => onAddIncome(income)}
                >
                    Add Income
                </button>
            </div>

        </div>
    )
}

export default AddIncomeForm