import { useEffect, useState } from "react";
import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";

const OrdersPage = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const response = await axios.get("http://35.88.242.25/api/orders/");
        const orders = response.data;

        setTotalOrders(orders.length);

        const pending = orders.filter((order) => order.status === "pending");
        const completed = orders.filter(
          (order) => order.status === "completed"
        );

        setPendingOrders(pending.length);
        setCompletedOrders(completed.length);

        const revenue = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Failed to fetch order stats:", error);
      }
    };

    fetchOrderStats();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Orders"} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Orders"
            icon={ShoppingBag}
            value={totalOrders}
            color="#6366F1"
          />
          <StatCard
            name="Pending Orders"
            icon={Clock}
            value={pendingOrders}
            color="#F59E0B"
          />
          <StatCard
            name="Completed Orders"
            icon={CheckCircle}
            value={completedOrders}
            color="#10B981"
          />
          <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={formatCurrency(totalRevenue)}
            color="#EF4444"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DailyOrders />
          <OrderDistribution />
        </div>
        <OrdersTable />
      </main>
    </div>
  );
};

export default OrdersPage;
