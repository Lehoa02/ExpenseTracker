import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor }) => {
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
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
            <Legend content={CustomLegend} />
                {showTextAnchor && (
                    <>
                    <text 
                        x="50%" 
                        y="50%" 
                        dy={-25}
                        textAnchor="middle" 
                        fontSize="14px"
                        fill="#666">
                        {label}
                    </text>
                    <text
                        x="50%" 
                        y="50%"
                        dy={0}
                        textAnchor="middle"
                        fontSize="24px"
                        fill="#333"
                        fontWeight="semi-bold"
                        >
                            {totalAmount}
                        </text>
                    </>
                )}

        </PieChart>
    </ResponsiveContainer>;
};
export default CustomPieChart
    
