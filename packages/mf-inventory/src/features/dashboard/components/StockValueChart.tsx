import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardChart } from '../../../api/dashboardApi';
import { useMemo } from 'react';

interface StockValueChartProps {
  data: DashboardChart[];
}

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE']; // Tailwind Blue 600-200

export const StockValueChart = ({ data }: StockValueChartProps) => {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.categoryName,
      value: item.totalValue,
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow h-[300px] flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow h-[300px]">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Value by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
             formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
