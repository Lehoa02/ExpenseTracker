import React, { useMemo } from "react";
import CustomPieChart from "../Charts/CustomPieChart";
import { prepareIncomeCategoryChartData } from '../../utils/helper';
import { useTheme } from '../../context/ThemeContext';

const BASE_COLORS = {
    light: ["#875CF5", "#4F39F6", "#0EA5E9", "#14B8A6", "#22C55E", "#F59E0B", "#F97316", "#EC4899"],
    dark: ["#A78BFA", "#818CF8", "#38BDF8", "#2DD4BF", "#4ADE80", "#FBBF24", "#FB923C", "#F472B6"],
};

const buildIncomeColors = (count, isDark) => {
    const palette = [...(isDark ? BASE_COLORS.dark : BASE_COLORS.light)];

    if (count <= palette.length) {
        return palette.slice(0, count);
    }

    for (let index = palette.length; index < count; index += 1) {
        const hue = (index * 47) % 360;
        const saturation = isDark ? 88 : 82;
        const lightness = isDark ? 62 : 52;

        palette.push(`hsl(${hue} ${saturation}% ${lightness}%)`);
    }

    return palette;
};

const RecentIncomeWithChart = ({ data, totalIncome }) => {
    const { isDark } = useTheme();

    const chartData = useMemo(() => prepareIncomeCategoryChartData(data), [data]);
    const colors = buildIncomeColors(chartData.length, isDark);

  return (
    <div className="card">
        <div className="flex items-center justify-between">
            <h5 className="text-lg">Last 60 Days Income</h5>
        </div>

        <CustomPieChart
            data={chartData}
            label="Total Income"
            totalAmount={totalIncome}
            showTextAnchor
            colors={colors}
        />

    </div>
    )
};

export default RecentIncomeWithChart;