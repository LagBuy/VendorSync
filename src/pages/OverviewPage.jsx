// import { useEffect, useState } from "react";
// import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
// import { motion } from "framer-motion";
// import Header from "../components/common/Header";
// import StatCard from "../components/common/StatCard";
// import SalesOverviewChart from "../components/overview/SalesOverviewChart";
// import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
// import SalesChannelChart from "../components/overview/SalesChannelChart";

// const OverViewPage = () => {
//   const [stats, setStats] = useState({
//     totalSales: 0,
//     newCustomers: 0,
//     totalProducts: 0,
//     conversionRate: 0,
//   });
  
//   const [exchangeRate, setExchangeRate] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState({ show: false, message: "" });

//   const fetchOverviewData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/overview");
//       if (!response.ok) throw new Error("Failed to fetch data");
//       const data = await response.json();
//       setStats({
//         totalSales: data.totalSales,
//         newCustomers: data.newCustomers,
//         totalProducts: data.totalProducts,
//         conversionRate: data.conversionRate,
//       });
//     } catch (err) {
//       console.error("Error fetching overview data:", err);
//       setToast({
//         show: true,
//         message: "⚠️ Failed to load overview stats. Please try again.",
//       });
//       setTimeout(() => setToast({ show: false, message: "" }), 4000);
//     }
//     setLoading(false);
//   };

//   const fetchExchangeRate = async () => {
//     try {
//       const exchangeResponse = await fetch(
//         "https://api.exchangerate-api.com/v4/latest/USD"
//       );
//       if (!exchangeResponse.ok)
//         throw new Error("Failed to fetch exchange rate");
//       const exchangeData = await exchangeResponse.json();
//       setExchangeRate(exchangeData.rates.NGN || 0);
//     } catch (err) {
//       console.error("Error fetching exchange rate:", err);
//     }
//   };

//   useEffect(() => {
//     fetchOverviewData();
//     fetchExchangeRate();
//   }, []);

//   const convertToNaira = (usdAmount) => {
//     return Math.round(usdAmount * exchangeRate);
//   };

//   const calculateConversionRate = (newCustomers, totalVisitors) => {
//     return totalVisitors
//       ? ((newCustomers / totalVisitors) * 100).toFixed(2)
//       : "0.00";
//   };

//   const handleCloseToast = () => {
//     setToast({ show: false, message: "" });
//   };

//   return (
//     <div className="flex-1 overflow-auto relative z-10 bg-[#1A362B] text-[#FFF9B0]">
//       <Header title="Overview" />

//       {/* Toast Notification - Responsive */}
//       {toast.show && (
//         <div className="fixed top-4 left-4 right-4 md:top-4 md:left-auto md:right-4 px-4 py-3 bg-[#D32F2F] text-[#FFF9B0] z-50 shadow-lg rounded-lg flex flex-wrap items-center justify-between gap-3 max-w-sm md:max-w-md w-full mx-auto md:mx-0 animate-pulse">
//           <span className="text-sm sm:text-base">{toast.message}</span>
//           <button
//             onClick={handleCloseToast}
//             className="font-bold text-lg text-white"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
//         {/* STATS */}
//         <motion.div
//           className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//         >
//           {loading ? (
//             <div className="flex justify-center py-10 col-span-full text-white">
//               Loading...
//             </div>
//           ) : (
//             <>
//               <StatCard
//                 name="Total Sales"
//                 icon={Zap}
//                 value={`₦${convertToNaira(stats.totalSales).toLocaleString()}`}
//                 color="#FFF9B0"
//                 backgroundColor="#1A362B"
//               />
//               <StatCard
//                 name="New Customers"
//                 icon={Users}
//                 value={stats.newCustomers}
//                 color="#FFF9B0"
//                 backgroundColor="#1A362B"
//               />
//               <StatCard
//                 name="Total Products"
//                 icon={ShoppingBag}
//                 value={stats.totalProducts}
//                 color="#FFF9B0"
//                 backgroundColor="#1A362B"
//               />
//               <StatCard
//                 name="Conversion Rate"
//                 icon={BarChart2}
//                 value={`${calculateConversionRate(stats.newCustomers, 1000)}%`}
//                 color="#FFF9B0"
//                 backgroundColor="#1A362B"
//               />
//             </>
//           )}
//         </motion.div>

//         {/* CHARTS */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <SalesOverviewChart />
//           <CategoryDistributionChart />
//           <SalesChannelChart />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default OverViewPage;


import { useEffect, useState } from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { axiosInstance } from "../axios-instance/axios-instance";

const OverViewPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    newCustomers: 0,
    totalProducts: 0,
    conversionRate: 0,
  });
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const [salesRes, newCustRes, prodRes] = await Promise.all([
        axiosInstance.get("/vendors/totalsale/"),
        axiosInstance.get("/vendors/newcustomers/"),
        axiosInstance.get("/vendors/totalproduct/"),
      ]);
      setStats({
        totalSales: salesRes.data.totalSale || 0, // Adjust based on actual response field
        newCustomers: newCustRes.data.newCustomers || 0,
        totalProducts: prodRes.data.totalProducts || 0,
        conversionRate: stats.conversionRate, // Keep calculated or fetch if available
      });
    } catch (err) {
      console.error("Error fetching overview data:", err);
      setToast({
        show: true,
        message: "⚠️ Failed to load overview stats. Please try again.",
      });
      setTimeout(() => setToast({ show: false, message: "" }), 4000);
    }
    setLoading(false);
  };

  const fetchExchangeRate = async () => {
    try {
      const exchangeResponse = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      if (!exchangeResponse.ok) throw new Error("Failed to fetch exchange rate");
      const exchangeData = await exchangeResponse.json();
      setExchangeRate(exchangeData.rates.NGN || 0);
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
    }
  };

  useEffect(() => {
    fetchOverviewData();
    fetchExchangeRate();
  }, []);

  const convertToNaira = (usdAmount) => {
    return Math.round(usdAmount * exchangeRate);
  };

  const calculateConversionRate = (newCustomers, totalVisitors = 1000) => {
    return totalVisitors
      ? ((newCustomers / totalVisitors) * 100).toFixed(2)
      : "0.00";
  };

  const handleCloseToast = () => {
    setToast({ show: false, message: "" });
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-[#1A362B] text-[#FFF9B0]">
      <Header title="Overview" />
      {toast.show && (
        <div className="fixed top-4 left-4 right-4 md:top-4 md:left-auto md:right-4 px-4 py-3 bg-[#D32F2F] text-[#FFF9B0] z-50 shadow-lg rounded-lg flex flex-wrap items-center justify-between gap-3 max-w-sm md:max-w-md w-full mx-auto md:mx-0 animate-pulse">
          <span className="text-sm sm:text-base">{toast.message}</span>
          <button onClick={handleCloseToast} className="font-bold text-lg text-white">
            ×
          </button>
        </div>
      )}
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {loading ? (
            <div className="flex justify-center py-10 col-span-full text-white">
              Loading...
            </div>
          ) : (
            <>
              <StatCard
                name="Total Sales"
                icon={Zap}
                value={`₦${convertToNaira(stats.totalSales).toLocaleString()}`}
                color="#FFF9B0"
                backgroundColor="#1A362B"
              />
              <StatCard
                name="New Customers"
                icon={Users}
                value={stats.newCustomers}
                color="#FFF9B0"
                backgroundColor="#1A362B"
              />
              <StatCard
                name="Total Products"
                icon={ShoppingBag}
                value={stats.totalProducts}
                color="#FFF9B0"
                backgroundColor="#1A362B"
              />
              <StatCard
                name="Conversion Rate"
                icon={BarChart2}
                value={`${calculateConversionRate(stats.newCustomers)}%`}
                color="#FFF9B0"
                backgroundColor="#1A362B"
              />
            </>
          )}
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverViewPage;