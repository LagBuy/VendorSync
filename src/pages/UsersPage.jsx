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

  // Function to calculate customer stats
  const calculateCustomerStats = (customers) => {
    const today = new Date();
    let newCustomers = 0;
    let active = 0;
    let lost = 0;

    customers.forEach((customer) => {
      const lastPurchaseDate = new Date(customer.lastPurchaseDate);
      const daysSinceLastPurchase = Math.floor(
        (today - lastPurchaseDate) / (1000 * 60 * 60 * 24)
      );

      // Checking role of the customer: "also a vendor" or "customer"
      customer.role =
        customer.businessType === "Vendor" ? "also a vendor" : "customer";

      if (daysSinceLastPurchase <= 1) {
        newCustomers++; // New customer who bought today
      } else if (daysSinceLastPurchase <= 90) {
        active++; // Active customers
      } else {
        lost++; // Lost customers who haven't bought in 3 months
      }
    });

    setTotalCustomers(customers.length);
    setNewCustomersToday(newCustomers);
    setActiveCustomers(active);
    setLostCustomers(lost);
  };

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/customers");
        setCustomers(data);
        calculateCustomerStats(data);
        toast.success("Customer data loaded successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Error fetching customers:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        
        const errorMessage = error.response?.data?.message || "Failed to load customer data.";
        toast.error(errorMessage, { 
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
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
          fontSize: '14px',
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