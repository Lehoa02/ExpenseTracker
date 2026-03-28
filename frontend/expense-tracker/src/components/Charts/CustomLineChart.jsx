import React from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { addThousandSeparator } from '../../utils/helper';

const LINE_PALETTE = {
    light: {
        line: '#875cf5',
        dot: '#ab8df8',
        activeDot: '#6d28d9',
        gradient: '#875cf5',
        axis: '#555',
        tooltipBg: 'bg-white border-gray-300',
        tooltipTitle: 'text-purple-800',
        tooltipText: 'text-gray-600',
        tooltipAmount: 'text-gray-900',
    },
    dark: {
        line: '#4CC9F0',
        dot: '#8DE0F7',
        activeDot: '#4CC9F0',
        activeDotStroke: '#B7F3FF',
        gradient: '#4CC9F0',
        axis: '#94a3b8',
        tooltipBg: 'bg-gray-800 border-slate-600',
        tooltipTitle: 'text-slate-200',
        tooltipText: 'text-slate-300',
        tooltipAmount: 'text-slate-100',
    },
};

const CustomLineChart = ({ data, onPointClick }) => {
    const { isDark } = useTheme();
    const palette = isDark ? LINE_PALETTE.dark : LINE_PALETTE.light;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className={`shadow-md rounded-lg p-2 border ${palette.tooltipBg}`}>
                <p className={`text-xs font-semibold mb-1 ${palette.tooltipTitle}`}>{payload[0].payload.category}</p>
                <p className={`text-sm ${palette.tooltipText}`}>
                    Amount: <span className={`text-sm font-medium ${palette.tooltipAmount}`}>${addThousandSeparator(payload[0].payload.amount)}</span>
                </p>
            </div>
    );
}
        return null;
    };

    return <div className="bg-transparent">
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
            <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={palette.gradient} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={palette.gradient} stopOpacity={0}/>
                </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="none" />
            <XAxis dataKey="month" tick={{ fill: palette.axis, fontSize: 12 }} stroke="none"/>
            <YAxis tick={{ fill: palette.axis, fontSize: 12 }} stroke="none" tickFormatter={(value) => addThousandSeparator(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Area
                type="monotone"
                dataKey="amount"
                stroke={palette.line}
                fill="url(#colorAmount)"
                strokeWidth={3}
                dot={(props) => {
                    const { cx, cy, payload } = props;

                    if (cx === undefined || cy === undefined) {
                        return null;
                    }

                    return (
                        <g style={{ cursor: onPointClick ? 'pointer' : 'default' }}>
                            <circle
                                cx={cx}
                                cy={cy}
                                r={11}
                                fill="transparent"
                                style={{ pointerEvents: 'all' }}
                                onMouseDown={() => onPointClick?.(payload)}
                                onClick={() => onPointClick?.(payload)}
                            />
                            <circle
                                cx={cx}
                                cy={cy}
                                r={4}
                                fill={palette.dot}
                                stroke={isDark ? '#0f172a' : '#ffffff'}
                                strokeWidth={2}
                                style={{ pointerEvents: 'none' }}
                            />
                        </g>
                    );
                }}
                activeDot={{ r: 6, fill: palette.activeDot, stroke: isDark ? palette.activeDotStroke : '#0f172a', strokeWidth: 2 }}
            />
            </AreaChart>
            </ResponsiveContainer>
    </div>
}

export default CustomLineChart;