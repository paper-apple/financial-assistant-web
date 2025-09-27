import type { ChartData } from "chart.js"
import { Pie } from "react-chartjs-2"

type Props = {
  chartData: ChartData<"pie", number[], string>;
};

export const StatsChart = ({ chartData }: Props) => 
{          
  return (
    // <Pie data={chartData} />
    <div className="w-full h-full">
      <Pie data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  )
}