import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, Package, TrendingUp, DollarSign, Sparkles, Zap, ArrowUpRight, ShoppingCart } from "lucide-react";
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
  const [lowStockCount, setLowStockCount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [exchangeRateDate, setExchangeRateDate] = useState(null);
  const [showTopToast, setShowTopToast] = useState(false);
  const [showLowToast, setShowLowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, lowStockRes, rateRes] = await Promise.all([
          axiosInstance.get("/products/"),
          axiosInstance.get("/vendors/lowstockcount/?lt=10"),
          axios.get("https://api.exchangerate.host/latest?base=USD&symbols=NGN"),
        ]);

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

        if (err.response?.config?.url.includes("lowstockcount")) {
          const productsData = products.length > 0 ? products : [];
          const lowStockItems = productsData.filter((p) => (p.stock || 0) < 10).slice(0, 5);
          setLowStock(lowStockItems);
          setLowStockCount(lowStockItems.length);
        }
      } finally {
        setIsLoading(false);
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

  // Loading animation
  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto relative z-10 bg-black min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl font-semibold">Loading Products...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-black min-h-screen">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <Header 
        title="Products Dashboard" 
        className="text-white font-bold text-4xl mb-8 relative z-10"
        icon={<Sparkles className="text-yellow-500 mr-3" />}
      />

      <main className="max-w-7xl mx-auto py-8 px-6 lg:px-12 relative z-10">
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", staggerChildren: 0.1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatCard
              name="Total Products"
              icon={Package}
              value={totalProducts}
              color="#22C55E"
              className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 border border-gray-800 hover:border-yellow-500/50 text-white text-xl backdrop-blur-sm"
              iconBg="bg-green-500/20"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              className="relative group"
              onMouseEnter={() => setShowTopToast(true)}
              onMouseLeave={() => setShowTopToast(false)}
            >
              <StatCard
                name="Top Selling"
                icon={TrendingUp}
                value={topSelling.length}
                color="#22C55E"
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 border border-gray-800 hover:border-yellow-500/50 text-white text-xl backdrop-blur-sm group-hover:scale-105"
                iconBg="bg-yellow-500/20"
              />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <AnimatePresence>
                {showTopToast && (
                  <motion.div
                    className="absolute -top-4 right-0 translate-y-[-100%] bg-gray-900 border-2 border-yellow-500 rounded-2xl shadow-2xl w-80 z-50 backdrop-blur-sm"
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5">
                      <div className="flex items-center mb-4">
                        <Zap className="text-yellow-500 mr-2" size={20} />
                        <h4 className="text-lg font-bold text-yellow-500">
                          Top Selling Products
                        </h4>
                      </div>
                      <ul className="space-y-3">
                        {topSelling.map((product, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-center justify-between text-white hover:text-yellow-500 transition-colors duration-300 group/item"
                            whileHover={{ x: 5 }}
                          >
                            <span>• {product.name}</span>
                            <span className="text-green-500 text-sm font-semibold group-hover/item:text-yellow-500">
                              {product.sales || 0} sold
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              className="relative group"
              onMouseEnter={() => setShowLowToast(true)}
              onMouseLeave={() => setShowLowToast(false)}
            >
              <StatCard
                name="Low Stock"
                icon={AlertTriangle}
                value={lowStockCount}
                color="#EF4444"
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-red-500/20 transition-all duration-500 border border-gray-800 hover:border-red-500/50 text-white text-xl backdrop-blur-sm group-hover:scale-105"
                iconBg="bg-red-500/20"
              />
              
              <AnimatePresence>
                {showLowToast && (
                  <motion.div
                    className="absolute -top-4 right-0 translate-y-[-100%] bg-gray-900 border-2 border-red-500 rounded-2xl shadow-2xl w-80 z-50 backdrop-blur-sm"
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5">
                      <div className="flex items-center mb-4">
                        <AlertTriangle className="text-red-500 mr-2" size={20} />
                        <h4 className="text-lg font-bold text-red-500">
                          Low Stock Alert
                        </h4>
                      </div>
                      <ul className="space-y-3">
                        {lowStock.map((product, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-center justify-between text-white hover:text-red-500 transition-colors duration-300 group/item"
                            whileHover={{ x: 5 }}
                          >
                            <span>• {product.name}</span>
                            <span className="text-red-500 text-sm font-semibold">
                              {product.stock || 0} left
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StatCard
              name="Total Revenue"
              icon={DollarSign}
              value={formatCurrency(totalRevenueNGN)}
              color="#22C55E"
              className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-green-500/20 transition-all duration-500 border border-gray-800 hover:border-green-500/50 text-white text-xl backdrop-blur-sm"
              iconBg="bg-green-500/20"
            />
          </motion.div>
        </motion.div>

        {/* Exchange Rate Banner */}
        {exchangeRateDate && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="text-yellow-500 mr-3" size={20} />
                <p className="text-white font-semibold">
                  Exchange rate: <span className="text-green-500">1 USD = {exchangeRate?.toFixed(2)} NGN</span>
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                Last updated: {exchangeRateDate}
              </p>
            </div>
          </motion.div>
        )}

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 mb-12 border border-gray-800 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Package className="mr-3 text-yellow-500" size={24} />
              Product Inventory
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold hover:bg-yellow-400 transition-colors duration-300"
            >
              Export Data
              <ArrowUpRight className="ml-2" size={16} />
            </motion.button>
          </div>
          <ProductsTable setTotalProducts={setTotalProducts} className="text-white" />
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <TrendingUp className="mr-3 text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-white">Sales Trend</h3>
            </div>
            <SalesTrendChart />
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <Sparkles className="mr-3 text-green-500" size={24} />
              <h3 className="text-xl font-bold text-white">Category Distribution</h3>
            </div>
            <CategoryDistributionChart />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProductsPage;