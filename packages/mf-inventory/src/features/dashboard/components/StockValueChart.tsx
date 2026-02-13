import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardChart } from '../../../api/dashboardApi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface StockValueChartProps {
  data: DashboardChart[];
}

const COLORS = [
  '#2563EB', // Blue 600
  '#DC2626', // Red 600
  '#D97706', // Amber 600
  '#059669', // Emerald 600
  '#7C3AED', // Violet 600
  '#DB2777', // Pink 600
  '#475569', // Slate 600
];

export const StockValueChart = ({ data }: StockValueChartProps) => {
  const { t, i18n } = useTranslation();

  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.categoryName,
      value: item.totalValue,
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow h-[300px] flex items-center justify-center text-gray-500">
        {t('dashboard.charts.noData')}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow h-[300px]">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.charts.stockValue')}</h3>
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
             formatter={(value: number) => new Intl.NumberFormat(i18n.language || 'es-CO', { style: 'currency', currency: 'COP' }).format(value)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
