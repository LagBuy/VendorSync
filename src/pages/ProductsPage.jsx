import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, Package, TrendingUp, DollarSign } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import { axiosInstance } from "../axios-instance/axios-instance";
import { toast } from "react-toastify";
import axios from "axios";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [topSelling, setTopSelling] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0); // New state for low_stock_count
  const [exchangeRate, setExchangeRate] = useState(null);
  const [exchangeRateDate, setExchangeRateDate] = useState(null);
  const [showTopToast, setShowTopToast] = useState(false);
  const [showLowToast, setShowLowToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, lowStockRes, rateRes] = await Promise.all([
          axiosInstance.get("/products/"),
          axiosInstance.get("/vendors/lowstockcount/?lt=10"),
          axios.get("https://api.exchangerate.host/latest?base=USD&symbols=NGN"),
        ]);

        console.log("Products Response:", productsRes.data);
        console.log("Low Stock Response:", lowStockRes.data);

        const productsData = productsRes.data?.data || productsRes.data || [];
        const lowStockData = lowStockRes.data?.data?.low_stock_products || [];
        const lowStockCountData = lowStockRes.data?.data?.low_stock_count || 0;
        const exchangeRateValue = rateRes.data.rates.NGN;
        const exchangeRateTime = rateRes.data.date;

        const sortedBySales = [...productsData].sort((a, b) => (b.sales || 0) - (a.sales || 0));
        const lowStockItems = lowStockData.length > 0 
          ? lowStockData.slice(0, 5)
          : productsData.filter((p) => (p.stock || 0) < 10).slice(0, 5);

        setProducts(productsData);
        setTopSelling(sortedBySales.slice(0, 5));
        setLowStock(lowStockItems);
        setLowStockCount(lowStockCountData);
        setExchangeRate(exchangeRateValue);
        setExchangeRateDate(exchangeRateTime);
        setTotalProducts(productsData.length);
      } catch (err) {
        console.error("Failed to fetch data:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        toast.error(err.response?.data?.detail || "Failed to fetch products or low stock data. Please check your authentication or permissions.");

        // Fallback for low stock if endpoint fails
        if (err.response?.config?.url.includes("lowstockcount")) {
          const productsData = products.length > 0 ? products : [];
          const lowStockItems = productsData.filter((p) => (p.stock || 0) < 10).slice(0, 5);
          setLowStock(lowStockItems);
          setLowStockCount(lowStockItems.length);
        }
      }
    };

    fetchData();
  }, []);

  const totalRevenueUSD = products.reduce(
    (sum, product) => sum + (product.price || 0) * (product.sales || 0),
    0
  );

  const totalRevenueNGN = exchangeRate ? totalRevenueUSD * exchangeRate : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Products" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Products"
            icon={Package}
            value={totalProducts}
            color="#6366F1"
          />  
          <div
            className="relative"
            onMouseEnter={() => setShowTopToast(true)}
            onMouseLeave={() => setShowTopToast(false)}
            onClick={() => setShowTopToast((prev) => !prev)}
          >
            <StatCard
              name="Top Selling"
              icon={TrendingUp}
              value={topSelling.length}
              color="#10B981"
            />
            {showTopToast && (
              <motion.div
                className="absolute -top-4 right-0 translate-y-[-100%] bg-gray-900 text-gray-100 border border-gray-700 rounded-xl shadow-lg w-64 z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="p-4">
                  <h4 className="text-sm font-semibold mb-2 text-green-400">
                    🔥 Fast Selling Products:
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {topSelling.map((product, index) => (
                      <li key={index} className="hover:text-green-400">
                        • {product.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
          <div
            className="relative"
            onMouseEnter={() => setShowLowToast(true)}
            onMouseLeave={() => setShowLowToast(false)}
            onClick={() => setShowLowToast((prev) => !prev)}
          >
            <StatCard
              name="Low Stock"
              icon={AlertTriangle}
              value={lowStockCount}
              color="#F59E0B"
            />
            {showLowToast && (
              <motion.div
                className="absolute -top-4 right-0 translate-y-[-100%] bg-gray-900 text-gray-100 border border-gray-700 rounded-xl shadow-lg w-64 z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="p-4">
                  <h4 className="text-sm font-semibold mb-2 text-yellow-400">
                    ⚠️ Low Stock Products:
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {lowStock.map((product, index) => (
                      <li key={index} className="hover:text-yellow-400">
                        • {product.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
          <StatCard
            name="Total Revenue In Naira"
            icon={DollarSign}
            value={formatCurrency(totalRevenueNGN)}
            color="#EF4444"
          />
        </motion.div>

        {exchangeRateDate && (
          <p className="text-sm text-gray-500 mb-4">
            Exchange rate last updated on: {exchangeRateDate}
          </p>
        )}

        <ProductsTable setTotalProducts={setTotalProducts} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-20">
          <SalesTrendChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;