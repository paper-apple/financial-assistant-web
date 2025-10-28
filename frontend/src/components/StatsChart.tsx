import type { ChartData } from "chart.js"
import { Pie, Bar} from "react-chartjs-2"

type Props = {
  chartData: ChartData<"pie", number[], string>;
};

export const StatsChart = ({ chartData }: Props) => 
{          
  return (
    // <Pie data={chartData} />
    <div className="w-full h-full">
      {/* <Pie data={chartData} options={{ maintainAspectRatio: false }} /> */}
      <Pie
        data={chartData}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            // legend: { position: "top" as const },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const ds = context.dataset as any;
                  const i = context.dataIndex;
                  const total = ds.data[i];
                  const { count, proportion } = ds.meta[i];
                  return [`Сумма: ${total}`, `Кол-во: ${count}`, `Доля: ${proportion} %`];
                },
              },
            },
          },
          // scales: {
          //   x: { beginAtZero: true },
          //   y: { beginAtZero: true },
          // },
        }}
      />
    </div>
  )
}