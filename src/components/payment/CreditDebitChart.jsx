import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// Month names
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Dummy data for each month
const generateDummyData = () =>
  months.map(() => ({
    credit: Math.floor(Math.random() * 10000),
    debit: Math.floor(Math.random() * 8000),
  }));

const fullYearData = generateDummyData();

const CreditDebitChart = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1)
  ); // Jan 1st
  const [endDate, setEndDate] = useState(new Date()); // today

  // Convert date to month index
  const getMonthIndex = (date) => date.getMonth();

  const getFilteredData = () => {
    const startMonth = getMonthIndex(startDate);
    const endMonth = getMonthIndex(endDate);

    return {
      labels: months.slice(startMonth, endMonth + 1),
      data: fullYearData.slice(startMonth, endMonth + 1),
    };
  };

  const { labels, data: currentData } = getFilteredData();

  const chartData = {
    labels,
    datasets: [
      {
        label: "Credit (₦)",
        data: currentData.map((item) => item.credit),
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Debit (₦)",
        data: currentData.map((item) => item.debit),
        borderColor: "rgba(239,68,68,1)",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "#444" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "#444" },
      },
    },
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-xl">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">
        <h2 className="text-2xl font-bold text-white">
          Credit & Debit Summary
        </h2>

        {/* Date Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm mb-1">Start Month</span>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="MMM yyyy"
              showMonthYearPicker
              className="bg-gray-800 text-white py-2 px-4 rounded-xl font-medium"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm mb-1">End Month</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="MMM yyyy"
              showMonthYearPicker
              className="bg-gray-800 text-white py-2 px-4 rounded-xl font-medium"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" />
          <span className="text-white font-medium">Credit</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
          <span className="text-white font-medium">Debit</span>
        </div>
      </div>

      <Line data={chartData} options={options} />
    </div>
  );
};

export default CreditDebitChart;
