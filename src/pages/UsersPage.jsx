import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../axios-instance/axios-instance";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/customers/UsersTable";
import UserGrowthChart from "../components/customers/UserGrowthChart";
import UserActivityHeatmap from "../components/customers/UserActivityHeatmap";
import UserDemographicsChart from "../components/customers/UserDemographicsChart";

const UsersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [newCustomersToday, setNewCustomersToday] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [lostCustomers, setLostCustomers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch customers overview data
        console.log(
          "Fetching customers overview from /vendors/customers-overview/..."
        );
        const overviewResponse = await axiosInstance.get(
          "/vendors/customers-overview/"
        );
        console.log(
          "Customers overview fetched successfully:",
          overviewResponse.data
        );

        // Extract metrics from overview response
        const overviewData = overviewResponse.data;
        setTotalCustomers(overviewData.total || 0);
        setNewCustomersToday(overviewData.newToday || 0);
        setActiveCustomers(overviewData.active || 0);
        setLostCustomers(overviewData.lost || 0);

        // Fetch customers data for table and charts
        console.log(
          "Fetching customers data for table from /vendors/customers/..."
        );
        const customersResponse = await axiosInstance.get(
          "/vendors/customers/"
        );
        console.log(
          "Customers data fetched successfully:",
          customersResponse.data
        );

        setCustomers(customersResponse.data);

        toast.success("Customer data loaded successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
      } catch {
        // Set fallback values on error
        setCustomers([]);
        setTotalCustomers(0);
        setNewCustomersToday(0);
        setActiveCustomers(0);
        setLostCustomers(0);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gradient-to-br from-[#111827] to-[#000000] min-h-screen">
      <Header title="Customers" />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          fontSize: "14px",
        }}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#111827] to-[#000000] rounded-xl p-6 border border-[#1F2937] animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-[#1F2937] rounded w-20"></div>
                    <div className="h-6 bg-[#1F2937] rounded w-16"></div>
                  </div>
                  <div className="h-10 w-10 bg-[#1F2937] rounded-lg"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              <StatCard
                name="Total Customers"
                icon={UsersIcon}
                value={totalCustomers.toLocaleString()}
                color="#EAB308"
                trend={{ value: 12.5, isPositive: true }}
              />
              <StatCard
                name="New Customers Today"
                icon={UserPlus}
                value={newCustomersToday}
                color="#22C55E"
                trend={{ value: 8.2, isPositive: true }}
              />
              <StatCard
                name="Active Customers"
                icon={UserCheck}
                value={activeCustomers.toLocaleString()}
                color="#EAB308"
                trend={{ value: 5.7, isPositive: true }}
              />
              <StatCard
                name="Lost Customers"
                icon={UserX}
                value={lostCustomers}
                color="#EF4444"
                trend={{ value: 2.1, isPositive: false }}
              />
            </>
          )}
        </motion.div>

        {/* USER TABLE */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="bg-gradient-to-br from-[#111827] to-[#000000] rounded-xl p-6 border border-[#1F2937] text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading customer data...</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#111827] to-[#000000] rounded-xl border border-[#1F2937] shadow-lg overflow-hidden">
              <UsersTable customers={customers} />
            </div>
          )}
        </motion.div>

        {/* USER CHARTS */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-br from-[#111827] to-[#000000] rounded-xl p-6 border border-[#1F2937] shadow-lg">
            <UserGrowthChart />
          </div>
          <div className="bg-gradient-to-br from-[#111827] to-[#000000] rounded-xl p-6 border border-[#1F2937] shadow-lg">
            <UserActivityHeatmap />
          </div>
          <div className="lg:col-span-2 bg-gradient-to-br from-[#111827] to-[#000000] rounded-xl p-6 border border-[#1F2937] shadow-lg">
            <UserDemographicsChart />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UsersPage;
