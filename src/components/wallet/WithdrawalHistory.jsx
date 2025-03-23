import { ChartColumnStacked, TrendingUp } from "lucide-react";
import Chart, { plugins } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "./CashFlow.css";

const CashFlow = () => {
  const getGradient = (ctx, chartArea) => {
    let gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top
    );
    gradient.addColorStop(0.9, "rgba(21, 123,248, 0.2)");
    gradient.addColorStop(0, "transparent");
    return gradient;
  };

  const config = {
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "April",
        "May",
        "June",
        "July",
        "August",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],

      datasets: [
        {
          data: [3, 5, 9, 12, 9, 11, 10, 1, 0, 4, 6, 7, 18, 24],
          borderWidth: 2,
          borderColor: "#157bf8",
          lineTension: 0.8,
          fill: true,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return;
            return getGradient(ctx, chartArea);
          },
        },
      ],
    },

    options: {
      scales: {
        y: { beginAtZero: true },
      },

      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="cash-flow">
      <div className="cash-flow-header">
        <h2 className="title">Withdrawal History</h2>
        <div className="row round-btns">
          <div className="rounded-icon-btn">
            <TrendingUp className="icon" />
          </div>

          <div className="rounded-icon-btn btn-primary">
            <ChartColumnStacked className="icon" />
          </div>
        </div>
      </div>

      {/* THE NEXT COMPONENT: */}
      <div className="row trending-report">
        <div className="rounded-icon-btn btn-primary">
          <TrendingUp className="icon" />
        </div>
        <h3>Withdrawal Trends</h3>
        <TrendingUp className="icon primary" />
        <p className="success">+2.05%</p>
      </div>
      <Line data={config.data} options={config.options} />
    </div>
  );
};

export default CashFlow;
