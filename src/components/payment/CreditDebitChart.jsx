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
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CreditDebitChart = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(new Date());
  const [chartDataList, setChartDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [error, setError] = useState(null);

  const formatDateForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  // Auto-dismiss error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const startMonth = formatDateForApi(startDate);
        const endMonth = formatDateForApi(endDate);
        const { data } = await axiosInstance.get("/credit-debit", {
          params: { startMonth, endMonth },
        });
        
        const processedData = data.map((item) => ({
          credit: item.credit ?? 0,
          debit: item.debit ?? 0,
          month: item.month,
        }));
        
        setChartDataList(processedData);
        
        // Calculate totals
        const creditTotal = processedData.reduce((sum, item) => sum + item.credit, 0);
        const debitTotal = processedData.reduce((sum, item) => sum + item.debit, 0);
        setTotalCredit(creditTotal);
        setTotalDebit(debitTotal);
        
        toast.success("📊 Financial data loaded successfully!", {
          position: "top-right",
          theme: "dark",
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error fetching credit/debit data:", error);
        const errorMessage = error.response?.data?.message;
        setError(errorMessage);
        toast.error(errorMessage, { 
          position: "top-right",
          theme: "dark",
          autoClose: 1000,
        });
        setChartDataList([]);
        setTotalCredit(0);
        setTotalDebit(0);
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
        borderColor: "#22C55E", // Green-500
        backgroundColor: "rgba(34, 197, 94, 0.1)", // Green with 10% opacity
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#22C55E",
        pointBorderColor: "#000000",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Debit (₦)",
        data: currentData.map((item) => item.debit),
        borderColor: "#EF4444", // Red-500
        backgroundColor: "rgba(239, 68, 68, 0.1)", // Red with 10% opacity
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#EF4444",
        pointBorderColor: "#000000",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)", // Gray-900 with opacity
        titleColor: "#EAB308", // Yellow-500
        bodyColor: "#FFFFFF", // White
        borderColor: "#EAB308", // Yellow-500
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return ` ${context.dataset.label}: ₦${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: { 
          color: "#9CA3AF", // Gray-400
          font: { size: 12, weight: "500" }
        },
        grid: { 
          color: "rgba(31, 41, 55, 0.6)", // Gray-800 with opacity
          drawBorder: false,
        },
      },
      y: {
        ticks: { 
          color: "#9CA3AF", // Gray-400
          font: { size: 12, weight: "500" },
          callback: function(value) {
            return `₦${value.toLocaleString()}`;
          }
        },
        grid: { 
          color: "rgba(31, 41, 55, 0.6)", // Gray-800 with opacity
          drawBorder: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-green-500"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-500/5 rounded-full blur-3xl"></div>

      <ToastContainer 
        position="top-right"
        theme="dark"
        autoClose={3000}
        toastClassName="bg-gray-900 border border-gray-800"
      />
      
      <div className="relative z-10">
        {/* Error Message - Auto-dismisses after 3 seconds */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
          <div className="flex-1">
            <motion.div 
              className="flex items-center gap-3 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-2 bg-yellow-500/10 rounded-xl">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Financial Overview
              </h2>
            </motion.div>
            <motion.p 
              className="text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Track your credit and debit transactions over time
            </motion.p>
          </div>

          {/* Date Filters */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                className="bg-gray-800/50 border border-gray-700 text-white py-3 px-4 rounded-xl font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                className="bg-gray-800/50 border border-gray-700 text-white py-3 px-4 rounded-xl font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300"
                disabled={loading}
              />
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Credit</p>
                  <p className="text-2xl font-bold text-white">₦{totalCredit.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-semibold">
                +{((totalCredit - totalDebit) / totalDebit * 100 || 0).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <ArrowTrendingDownIcon className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Debit</p>
                  <p className="text-2xl font-bold text-white">₦{totalDebit.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-red-400 text-sm font-semibold">
                -{((totalDebit - totalCredit) / totalCredit * 100 || 0).toFixed(1)}%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart Legend */}
        <motion.div 
          className="flex items-center gap-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white font-medium text-sm">Credit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white font-medium text-sm">Debit</span>
          </div>
        </motion.div>

        {/* Chart Container */}
        <motion.div 
          className="relative h-80 bg-gray-800/30 rounded-2xl border border-gray-700/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <AnimatePresence>
            {loading ? (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-2xl backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
                    <CurrencyDollarIcon className="h-5 w-5 text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-gray-400 mt-3 font-medium">Loading financial data...</p>
                </div>
              </motion.div>
            ) : chartDataList.length === 0 ? (
              <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/50 rounded-2xl backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-gray-400 mb-2">📊</div>
                <p className="text-gray-400 font-medium">No data available</p>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your date range</p>
              </motion.div>
            ) : (
              <Line data={chartData} options={options} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Summary Footer */}
        {!loading && chartDataList.length > 0 && (
          <motion.div 
            className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">
                Data updated in real-time
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              Showing {currentData.length} period{currentData.length !== 1 ? 's' : ''}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CreditDebitChart;