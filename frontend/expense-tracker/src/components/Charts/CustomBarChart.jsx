import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { addThousandSeparator } from '../../utils/helper';

const BAR_PALETTE = {
    light: {
        bars: ['#875cf5', '#cfbefb'],
        hoverBars: ['#6d28d9', '#ddd6fe'],
        axis: '#555',
        hoverCursor: 'rgba(139, 92, 246, 0.12)',
        tooltipBg: 'bg-white border-gray-300',
        tooltipTitle: 'text-purple-800',
        tooltipText: 'text-gray-600',
        tooltipAmount: 'text-gray-900',
    },
    dark: {
        bars: ['#7C5CFF', '#00C2A8'],
        hoverBars: ['#9A82FF', '#2EE6C7'],
        axis: '#94a3b8',
        hoverCursor: 'rgba(124, 92, 255, 0.18)',
        tooltipBg: 'bg-gray-800 border-slate-600',
        tooltipTitle: 'text-slate-200',
        tooltipText: 'text-slate-300',
        tooltipAmount: 'text-slate-100',
    },
};

const CustomBarChart = ({ data, onPointClick }) => {
    const { isDark } = useTheme();
    const palette = isDark ? BAR_PALETTE.dark : BAR_PALETTE.light;
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const displayKey = data[0]?.month ? "month" : "category";

//Function to alternate colors
const getBarColor = (index) => {
    return palette.bars[index % palette.bars.length];
};

const getHoverBarColor = (index) => {
    return palette.hoverBars[index % palette.hoverBars.length];
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const label = payload[0]?.payload?.category || payload[0]?.payload?.source || payload[0]?.payload?.[displayKey];

        return (
            <div className={`shadow-md rounded-lg p-2 border ${palette.tooltipBg}`}>
                <p className={`text-xs font-semibold mb-1 ${palette.tooltipTitle}`}>{label}</p>
                <p className={`text-sm ${palette.tooltipText}`}>Amount: <span className={`text-sm font-medium ${palette.tooltipAmount}`}>${addThousandSeparator(payload[0].payload.amount)}</span></p>
                </div>
        );
    }

    return null;
};
    return (
        <div className='bg-transparent mt-6'>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey={displayKey} tick={{fontSize: 12, fill: palette.axis}} />
                    <YAxis tick={{fontSize: 12, fill: palette.axis}} stroke='none' tickFormatter={(value) => addThousandSeparator(value)} />
                    <Tooltip content={CustomTooltip} cursor={{ fill: palette.hoverCursor, radius: 8 }} />
                    
                    <Bar
                        dataKey="amount"
                        fill={palette.bars[0]}
                        radius={[10,10,0,0]}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(-1)}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={activeIndex === index ? getHoverBarColor(index) : getBarColor(index)}
                                style={{ cursor: onPointClick ? 'pointer' : 'default' }}
                                onClick={() => onPointClick?.(entry)}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomBarChart