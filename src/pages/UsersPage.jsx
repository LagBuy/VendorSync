import { useState, useEffect } from "react";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/customers/UsersTable";
import UserGrowthChart from "../components/customers/UserGrowthChart";
import UserActivityHeatmap from "../components/customers/UserActivityHeatmap";
import UserDemographicsChart from "../components/customers/UserDemographicsChart";

// Fetching logic for dynamic customer stats
const fetchCustomers = async () => {
  // Make an API call to get all customers and their purchase history
  const response = await fetch("https://your-backend-api/customers"); // Replace with your actual backend endpoint
  const data = await response.json();
  return data;
};

const UsersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [newCustomersToday, setNewCustomersToday] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [lostCustomers, setLostCustomers] = useState(0);

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
      const customersData = await fetchCustomers();
      setCustomers(customersData);
      calculateCustomerStats(customersData);
    };

    loadCustomers(); // Fetch customers data on mount
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Customers" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Customers"
            icon={UsersIcon}
            value={totalCustomers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="New Customers Today"
            icon={UserPlus}
            value={newCustomersToday}
            color="#10B981"
          />
          <StatCard
            name="Active Customers"
            icon={UserCheck}
            value={activeCustomers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="Lost Customers"
            icon={UserX}
            value={lostCustomers}
            color="#EF4444"
          />
        </motion.div>

        <UsersTable customers={customers} />

        {/* USER CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <UserGrowthChart />
          <UserActivityHeatmap />
          <UserDemographicsChart />
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
