import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { addThousandSeparator, prepareProfitBarChartData } from '../../utils/helper';

const BAR_PALETTE = {
	light: {
		income: '#875cf5',
		expense: '#cfbefb',
		axis: '#475569',
		grid: '#e2e8f0',
		hoverCursor: 'rgba(139, 92, 246, 0.10)',
		tooltipBg: 'bg-white border-gray-300',
		tooltipTitle: 'text-purple-800',
		tooltipText: 'text-gray-600',
		tooltipValue: 'text-gray-900',
		legendText: 'text-gray-700',
	},
	dark: {
		income: '#8B5CF6',
		expense: '#C084FC',
		axis: '#cbd5e1',
		grid: '#334155',
		hoverCursor: 'rgba(139, 92, 246, 0.18)',
		tooltipBg: 'bg-gray-800 border-slate-600',
		tooltipTitle: 'text-slate-200',
		tooltipText: 'text-slate-300',
		tooltipValue: 'text-slate-100',
		legendText: 'text-slate-300',
	},
};

const ProfitBarChart = ({ data = [], incomeTransactions = [], expenseTransactions = [], onMonthClick }) => {
	const { isDark } = useTheme();
	const palette = isDark ? BAR_PALETTE.dark : BAR_PALETTE.light;

	const chartData = React.useMemo(() => {
		if (data?.length) {
			return data;
		}

		return prepareProfitBarChartData(incomeTransactions, expenseTransactions);
	}, [data, incomeTransactions, expenseTransactions]);

	const CustomTooltip = ({ active, payload }) => {
		if (!active || !payload?.length) {
			return null;
		}

		const current = payload[0]?.payload || {};
		const profit = current.profit ?? current.total ?? 0;
		const profitColor = profit < 0
			? 'text-red-500'
			: profit > 0
				? 'text-emerald-500'
				: palette.tooltipValue;

		return (
			<div className={`shadow-md rounded-lg p-3 border ${palette.tooltipBg}`}>
				<p className={`text-xs font-semibold mb-2 ${palette.tooltipTitle}`}>{current.month}</p>
				<div className={`flex items-center justify-between gap-4 text-sm ${palette.tooltipText}`}>
					<span>Income</span>
					<span className={`font-medium ${palette.tooltipValue}`}>${addThousandSeparator(current.income || 0)}</span>
				</div>
				<div className={`flex items-center justify-between gap-4 text-sm mt-1 ${palette.tooltipText}`}>
					<span>Expense</span>
					<span className={`font-medium ${palette.tooltipValue}`}>${addThousandSeparator(current.expense || 0)}</span>
				</div>
				<div className={`flex items-center justify-between gap-4 text-sm mt-2 pt-2 border-t ${isDark ? 'border-slate-600' : 'border-gray-200'} ${palette.tooltipText}`}>
					<span>Profit</span>
					<span className={`font-semibold ${profitColor}`}>${addThousandSeparator(profit)}</span>
				</div>
			</div>
		);
	};

	if (!chartData.length) {
		return (
			<div className={`mt-6 flex h-[300px] items-center justify-center rounded-2xl border border-dashed ${isDark ? 'border-slate-600 bg-slate-900/20 text-slate-400' : 'border-gray-200 bg-gray-50 text-gray-500'} text-sm`}>
				No monthly income or expense data yet.
			</div>
		);
	}

	return (
		<div className="mt-3 bg-transparent">
			<div className="mb-2 flex flex-wrap items-center gap-4 text-xs font-medium">
				<div className={`flex items-center gap-2 ${palette.legendText}`}>
					<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette.income }} />
					<span>Income</span>
				</div>
				<div className={`flex items-center gap-2 ${palette.legendText}`}>
					<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette.expense }} />
					<span>Expense</span>
				</div>
			</div>

			<ResponsiveContainer width="100%" height={320}>
				<BarChart data={chartData} barCategoryGap="28%" margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
					<CartesianGrid stroke={palette.grid} strokeDasharray="3 3" vertical={false} opacity={0.45} />
					<XAxis dataKey="month" tick={{ fontSize: 12, fill: palette.axis }} tickLine={false} axisLine={false} />
					<YAxis tick={{ fontSize: 12, fill: palette.axis }} tickLine={false} axisLine={false} tickFormatter={(value) => addThousandSeparator(value)} />
					<Tooltip content={<CustomTooltip />} cursor={{ fill: palette.hoverCursor, radius: 12 }} />
					<Legend content={() => null} />
					<Bar
						dataKey="income"
						stackId="profit"
						fill={palette.income}
						radius={[0, 0, 8, 8]}
						onClick={(barData) => onMonthClick?.(barData?.payload)}
					>
						{chartData.map((entry, index) => (
							<Cell key={`income-${entry.bucketKey}-${index}`} fill={palette.income} />
						))}
					</Bar>
					<Bar
						dataKey="expense"
						stackId="profit"
						fill={palette.expense}
						radius={[8, 8, 0, 0]}
						onClick={(barData) => onMonthClick?.(barData?.payload)}
					>
						{chartData.map((entry, index) => (
							<Cell key={`expense-${entry.bucketKey}-${index}`} fill={palette.expense} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default ProfitBarChart;
