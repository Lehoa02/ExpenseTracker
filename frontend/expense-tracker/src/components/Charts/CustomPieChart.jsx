import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';
import { useTheme } from '../../context/ThemeContext';
import { addThousandSeparator } from '../../utils/helper';

const PIE_PALETTE = {
    light: {
        centerLabel: '#666',
        centerValue: '#333',
        hoverStroke: '#ffffff',
    },
    dark: {
        centerLabel: '#94a3b8',
        centerValue: '#e2e8f0',
        hoverStroke: '#cbd5e1',
    },
};

const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor }) => {
    const { isDark } = useTheme();
    const palette = isDark ? PIE_PALETTE.dark : PIE_PALETTE.light;
    const [activeIndex, setActiveIndex] = React.useState(-1);

    return <ResponsiveContainer width="100%" height={380}>
        <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={130}
                innerRadius={100}
                dataKey="amount"
                nameKey="name"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                        opacity={activeIndex === -1 || activeIndex === index ? 1 : 0.45}
                        stroke={activeIndex === index ? palette.hoverStroke : 'transparent'}
                        strokeWidth={activeIndex === index ? 2 : 0}
                    />
                ))}
            </Pie>
            <Tooltip content={(props) => <CustomTooltip {...props} isDark={isDark} />} />
            <Legend content={(props) => <CustomLegend {...props} isDark={isDark} />} />
                {showTextAnchor && (
                    <>
                    <text 
                        x="50%" 
                        y="50%" 
                        dy={-25}
                        textAnchor="middle" 
                        fontSize="14px"
                        fill={palette.centerLabel}>
                        {label}
                    </text>
                    <text
                        x="50%" 
                        y="50%"
                        dy={0}
                        textAnchor="middle"
                        fontSize="24px"
                        fill={palette.centerValue}
                        fontWeight="semi-bold"
                        >
                            ${addThousandSeparator(totalAmount)}
                        </text>
                    </>
                )}

        </PieChart>
    </ResponsiveContainer>;
};
export default CustomPieChart
    
