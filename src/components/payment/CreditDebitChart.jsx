import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../axios-instance/axios-instance";
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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

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

const CreditDebitChart = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1)
  ); // Jan 1st
  const [endDate, setEndDate] = useState(new Date()); // Today
  const [chartDataList, setChartDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format date to YYYY-MM for API query
  const formatDateForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const startMonth = formatDateForApi(startDate);
        const endMonth = formatDateForApi(endDate);
        const { data } = await axiosInstance.get("/credit-debit", {
          params: { startMonth, endMonth },
        });
        setChartDataList(
          data.map((item) => ({
            credit: item.credit ?? 0,
            debit: item.debit ?? 0,
            month: item.month,
          }))
        );
        toast.success("Credit and debit data loaded successfully!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error fetching credit/debit data:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Failed to load credit/debit data.",
          { position: "top-center" }
        );
        setChartDataList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [startDate, endDate]);

  const getFilteredData = () => {
    if (!chartDataList.length) {
      return { labels: [], data: [] };
    }

    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth() + (endDate.getFullYear() > startDate.getFullYear() ? 12 : 0);

    const filteredData = chartDataList.filter((item) => {
      const [year, month] = item.month.split('-').map(Number);
      const monthIndex = (year - startDate.getFullYear()) * 12 + (month - 1);
      return monthIndex >= startMonth && monthIndex <= endMonth;
    });

    return {
      labels: filteredData.map((item) => {
        const monthIndex = Number(item.month.split('-')[1]) - 1;
        return months[monthIndex];
      }),
      data: filteredData,
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
        grid: { color: "auto" },
      },
    },
  };

  return (
    <div className="bg-gray-900 p-14 rounded-xl shadow-xl">
      <ToastContainer />
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
              className="bg-gray-800 text-white py-2 px-4 rounded-lg font-medium"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm mb-1">End Month</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="MMM yyyy"
              showMonthYearPicker
              className="bg-gray-800 text-white py-2 px-4 rounded-lg font-medium"
              disabled={loading}
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

      {loading ? (
        <div className="text-center py-6">
          <svg
            className="animate-spin h-8 w-8 text-white mx-auto"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      ) : chartDataList.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          No data available for the selected period.
        </div>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default CreditDebitChart;