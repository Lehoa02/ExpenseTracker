import React from 'react'
import { LuArrowUpRight, LuShieldCheck, LuSparkles, LuTrendingUpDown } from 'react-icons/lu'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggleButton from './ThemeToggleButton'

const AuthLayout = ({ children }) => {
  const { isDark } = useTheme()

  const shellClassName = isDark
    ? 'relative flex h-screen overflow-hidden bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-slate-100'
    : 'relative flex h-screen overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)] text-slate-900'

  const leftPanelClassName = 'relative w-full overflow-hidden px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-7 xl:w-[58vw]'

  const rightPanelClassName = isDark
    ? 'relative hidden xl:flex xl:w-[42vw] overflow-hidden border-l border-white/10 bg-[linear-gradient(145deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.98)_38%,rgba(88,28,135,0.9)_72%,rgba(14,116,144,0.7)_100%)] p-5 lg:p-6'
    : 'relative hidden xl:flex xl:w-[42vw] overflow-hidden border-l border-slate-200/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.98)_34%,rgba(233,213,255,0.95)_72%,rgba(224,242,254,0.95)_100%)] p-5 lg:p-6'

  return (
    <div className={shellClassName}>
      <div className={leftPanelClassName}>
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[580px] flex-col xl:max-w-[710px]">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-purple-500/25">
                <LuTrendingUpDown className="text-lg" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight">Expense Tracker</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Simple finance tracking for daily use</p>
              </div>
            </div>
            <ThemeToggleButton className="theme-toggle-icon-only shrink-0 rounded-full border border-slate-200/70 bg-white/70 p-2 text-slate-600 shadow-sm backdrop-blur hover:text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-white" iconClassName="text-lg" />
          </div>

          <div className="flex flex-1 items-center py-4 sm:py-5">
            {children}
          </div>
        </div>
      </div>

      <div className={rightPanelClassName}>
        <div className="absolute inset-y-0 left-0 w-px bg-white/35 dark:bg-white/10" />
        <div className="absolute -top-10 left-8 h-44 w-44 rounded-full bg-fuchsia-400/18 blur-3xl dark:bg-fuchsia-500/20" />
        <div className="absolute left-24 top-28 h-36 w-36 rounded-full bg-violet-500/16 blur-3xl dark:bg-violet-400/18" />
        <div className="absolute right-4 top-28 h-52 w-52 rounded-full bg-sky-300/14 blur-3xl dark:bg-cyan-400/14" />
        <div className="absolute bottom-10 right-10 h-44 w-44 rounded-full bg-cyan-400/12 blur-3xl dark:bg-teal-400/12" />

        <div className="relative z-10 flex w-full flex-col justify-center gap-4 xl:gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200">
              <LuSparkles className="text-base text-primary" />
              Modern finance in one calm dashboard
            </div>

            <div className="max-w-lg space-y-2">
              <h3 className={isDark ? 'text-3xl font-semibold tracking-tight text-slate-50 lg:text-[2.2rem] lg:leading-tight' : 'text-3xl font-semibold tracking-tight text-slate-900 lg:text-[2.2rem] lg:leading-tight'}>
                See your money clearly, without the clutter.
              </h3>
              <p className={isDark ? 'max-w-md text-sm leading-6 text-slate-300' : 'max-w-md text-sm leading-6 text-slate-600'}>
                Track income, expenses, and trends from a focused workspace built to feel fast, polished, and easy to trust.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="Monthly cash flow"
                value="$430,000"
                note="Up 18% from last month"
                isDark={isDark}
              />
              <MetricCard
                label="Budget coverage"
                value="92%"
                note="Bills and savings are on track"
                isDark={isDark}
              />
            </div>
          </div>

          <div className={isDark ? 'rounded-[28px] border border-white/10 bg-slate-950/35 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.22)] backdrop-blur-lg' : 'rounded-[28px] border border-white/45 bg-white/88 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-lg'}>
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className={isDark ? 'text-sm font-semibold text-white' : 'text-sm font-semibold text-slate-900'}>Profit summary</p>
                <p className={isDark ? 'text-xs text-slate-300' : 'text-xs text-slate-500'}>Monthly income vs expense</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <LuArrowUpRight className="text-sm" />
                Healthy growth
              </span>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr] xl:items-stretch">
              <div className="flex h-full min-h-[250px] flex-col justify-end gap-3 self-stretch">
                <div className="flex items-end gap-2.5">
                  {[
                    { month: 'Oct', income: 28, expense: 14 },
                    { month: 'Nov', income: 36, expense: 20 },
                    { month: 'Dec', income: 18, expense: 9 },
                    { month: 'Jan', income: 22, expense: 12 },
                    { month: 'Feb', income: 42, expense: 24 },
                    { month: 'Mar', income: 48, expense: 30 },
                  ].map((bar) => (
                    <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-[190px] w-full items-end justify-center rounded-full bg-slate-100/80 p-1.5 dark:bg-white/5">
                        <div className="flex h-full w-full flex-col justify-end gap-1.5">
                          <div className="rounded-full bg-primary/35" style={{ height: `${bar.expense}%` }} />
                          <div className="rounded-full bg-primary shadow-[0_10px_24px_rgba(124,58,237,0.22)]" style={{ height: `${bar.income}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1 text-center">
                        <p className={isDark ? 'text-[11px] font-semibold text-slate-300' : 'text-[11px] font-semibold text-slate-500'}>{bar.month}</p>
                        <p className={isDark ? 'text-[11px] font-medium text-white/75' : 'text-[11px] font-medium text-slate-900/70'}>${bar.income}k</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              <div className="flex h-full flex-col justify-between gap-2.5 self-stretch">
                <FeatureRow label="Track income and expenses" detail="Add transactions and see totals update instantly" isDark={isDark} />
                <FeatureRow label="Review monthly trends" detail="Compare cash flow, profit, and spending over time" isDark={isDark} />
                <FeatureRow label="Switch themes instantly" detail="Move between light and dark mode anytime" isDark={isDark} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

const MetricCard = ({ label, value, note, isDark }) => {
  const cardClassName = isDark
    ? 'rounded-[22px] border border-white/10 bg-slate-900/70 p-3.5 shadow-[0_18px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl'
    : 'rounded-[22px] border border-white/50 bg-white/80 p-3.5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl'
  const labelClassName = isDark ? 'text-xs font-medium uppercase tracking-[0.2em] text-slate-400' : 'text-xs font-medium uppercase tracking-[0.2em] text-slate-500'
  const valueClassName = isDark ? 'mt-3 text-2xl font-semibold tracking-tight text-white' : 'mt-3 text-2xl font-semibold tracking-tight text-slate-900'
  const noteClassName = isDark ? 'mt-2 text-sm text-slate-300' : 'mt-2 text-sm text-slate-600'

  return (
    <div className={cardClassName}>
      <p className={labelClassName}>{label}</p>
      <p className={valueClassName}>{value}</p>
      <p className={noteClassName}>{note}</p>
    </div>
  )
}

const FeatureRow = ({ label, detail, isDark }) => {
  const rowClassName = isDark
    ? 'rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-2 text-slate-100 shadow-[0_10px_40px_rgba(15,23,42,0.16)] backdrop-blur-sm'
    : 'rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-2 text-slate-900'

  return (
    <div className={rowClassName}>
      <p className="text-sm font-medium text-current">{label}</p>
      <p className={isDark ? 'mt-1 text-xs leading-4 text-slate-300' : 'mt-1 text-xs leading-4 text-slate-500'}>{detail}</p>
    </div>
  )
}