// StatsChart.tsx
import type { ChartData } from "chart.js"
import { Pie } from "react-chartjs-2"
import { getColor } from "../../hooks/useGetComputedStyle";
import { useTranslation } from "../../hooks/useTranslation";

type Props = {
  chartData: ChartData<"pie", number[], string>;
};

export const StatsChart = ({ chartData }: Props) => 
{            
  const { t } = useTranslation()

  return (
    <div className="w-full h-full">
      <Pie
        data={chartData}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: getColor('--text'),
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const ds = context.dataset as any;
                  const i = context.dataIndex;
                  const total = ds.data[i];
                  const { count, proportion } = ds.meta[i];
                  return [`${t('sum')}: ${total}`, `${t('quantity')}: ${count}`, `${t('sum')}: ${proportion} %`];
                },
              },
            },
          },
        }}
      />
    </div>
  )
}