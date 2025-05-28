import {
  BarChart2,
  Menu,
  DollarSign,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  WalletCards,
  Users,
} from "lucide-react";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/" },
  { name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
  { name: "Customers", icon: Users, color: "#EC4899", href: "/users" },
  { name: "Sales", icon: DollarSign, color: "#10B981", href: "/sales" },
  { name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
  { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
  { name: "Payment", icon: WalletCards, color: "#3B82F6", href: "/payment" },
  { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const location = useLocation(); // Track the current route

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = () => {
    if (isLargeScreen) {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  const sidebarWidth = isLargeScreen
    ? isSidebarOpen
      ? "w-64"
      : "w-20"
    : "w-20"; // Always collapsed on small screens

  const isActive = (href) => location.pathname === href; // Check if current path matches sidebar item

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${sidebarWidth}`}
      animate={{ width: isLargeScreen && isSidebarOpen ? 130 : 77 }}
    >
      <div className="h-screen bg-gray-800 p-4 flex flex-col border-r border-gray-700">
        {/* Show on all screens but only clickable on large screens */}
        <motion.button
          whileHover={isLargeScreen ? { scale: 1.1 } : {}}
          whileTap={isLargeScreen ? { scale: 0.9 } : {}}
          onClick={handleToggle}
          disabled={!isLargeScreen}
          className={`p-2 rounded-full transition-colors max-w-fit ${
            isLargeScreen
              ? "hover:bg-gray-700 cursor-pointer"
              : "opacity-100 cursor-not-allowed"
          }`}
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div
                className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 space-x-3 lg:flex-col lg:items-center lg:space-x-0 lg:space-y-8 ${
                  isActive(item.href)
                    ? "bg-gray-700 text-white" // Active item style
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <item.icon
                  size={20}
                  style={{
                    color: isActive(item.href) ? "white" : item.color,
                    minWidth: "20px",
                  }}
                />
                <AnimatePresence>
                  {isSidebarOpen && isLargeScreen && (
                    <motion.span
                      className="whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
