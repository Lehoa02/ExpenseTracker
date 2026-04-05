import React from 'react';
import { LuArrowRight, LuDollarSign, LuHandCoins, LuSparkles } from 'react-icons/lu';

const FirstTimeSetup = ({ onIncomeClick, onExpenseClick }) => {
    return (
        <div className="card overflow-hidden border-dashed border-primary/20 bg-gradient-to-br from-primary/5 via-white to-orange-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <LuSparkles className="text-sm" />
                        Start here
                    </div>
                    <h5 className="text-lg font-semibold text-gray-950 dark:text-white">Set up your first totals</h5>
                    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                        Add one income and one expense to unlock the charts, recent activity, and monthly profit view.
                    </p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-primary/15 bg-white p-5 shadow-sm shadow-primary/5 dark:border-slate-700 dark:bg-slate-900/80">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl text-white shadow-lg shadow-orange-500/25">
                            <LuDollarSign />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h6 className="text-base font-semibold text-gray-950 dark:text-white">Add your income</h6>
                            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                                Start with salary, freelance work, or any other money coming in.
                            </p>
                            <button className="card-btn mt-4 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800 dark:bg-slate-800 dark:text-slate-100" onClick={onIncomeClick}>
                                Go to Income <LuArrowRight className="text-base" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-primary/15 bg-white p-5 shadow-sm shadow-primary/5 dark:border-slate-700 dark:bg-slate-900/80">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-xl text-white shadow-lg shadow-red-500/25">
                            <LuHandCoins />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h6 className="text-base font-semibold text-gray-950 dark:text-white">Add your first expense</h6>
                            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                                Log a purchase or bill so the dashboard can calculate your balance.
                            </p>
                            <button className="card-btn mt-4 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 dark:bg-slate-800 dark:text-slate-100" onClick={onExpenseClick}>
                                Go to Expense <LuArrowRight className="text-base" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-primary/20 bg-white/70 px-4 py-3 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                Tip: you can also use the sidebar to jump between pages while you enter your first numbers.
            </div>
        </div>
    );
};

export default FirstTimeSetup;
