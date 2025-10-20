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
  { name: "Overview", icon: BarChart2, color: "#22C55E", href: "/" },
  { name: "Products", icon: ShoppingBag, color: "#22C55E", href: "/products" },
  { name: "Customers", icon: Users, color: "#22C55E", href: "/users" },
  { name: "Sales", icon: DollarSign, color: "#22C55E", href: "/sales" },
  { name: "Orders", icon: ShoppingCart, color: "#22C55E", href: "/orders" },
  { name: "Analytics", icon: TrendingUp, color: "#22C55E", href: "/analytics" },
  { name: "Payment", icon: WalletCards, color: "#22C55E", href: "/payment" },
  { name: "Settings", icon: Settings, color: "#22C55E", href: "/settings" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

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

  const isActive = (href) => location.pathname === href;

  return (
    <motion.div
      className="relative z-10 transition-all duration-300 ease-in-out flex-shrink-0"
      animate={{ width: isLargeScreen && isSidebarOpen ? 260 : 80 }}
      style={{
        backgroundColor: '#111827',
        borderRight: '1px solid #EAB308',
        background: 'linear-gradient(180deg, #111827 0%, #000000 100%)'
      }}
    >
      <div className="h-screen p-4 flex flex-col">
        {/* Header with Toggle Button */}
        <div className="flex items-center justify-between mb-8">
          <AnimatePresence>
            {isSidebarOpen && isLargeScreen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                     style={{ 
                       backgroundColor: '#EAB308',
                       background: 'linear-gradient(135deg, #EAB308 0%, #FBBF24 100%)'
                     }}>
                  <span className="text-sm font-bold" style={{ color: '#111827' }}>LB</span>
                </div>
                <span className="text-lg font-bold text-white">LAGBUY</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={isLargeScreen ? { 
              scale: 1.1, 
              backgroundColor: 'rgba(234, 179, 8, 0.2)',
              border: '1px solid rgba(234, 179, 8, 0.5)'
            } : {}}
            whileTap={isLargeScreen ? { scale: 0.9 } : {}}
            onClick={handleToggle}
            disabled={!isLargeScreen}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isLargeScreen
                ? "cursor-pointer hover:shadow-lg"
                : "cursor-not-allowed"
            }`}
            style={{
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              color: '#EAB308',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Menu size={20} />
          </motion.button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow overflow-y-auto space-y-2">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div
                className={`flex items-center p-1 m-2 rounded-xl transition-all duration-200 group relative ${
                  isActive(item.href)
                    ? "shadow-lg transform scale-105"
                    : "hover:shadow-md hover:transform hover:scale-105"
                }`}
                whileHover={{ x: 4 }}
                style={{
                  backgroundColor: isActive(item.href) 
                    ? 'rgba(234, 179, 8, 0.15)' 
                    : 'transparent',
                  color: isActive(item.href) 
                    ? '#EAB308' 
                    : 'rgba(255, 255, 255, 0.9)',
                  border: isActive(item.href) 
                    ? '1px solid rgba(234, 179, 8, 0.5)'
                    : '1px solid transparent',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Active Indicator */}
                {isActive(item.href) && (
                  <motion.div
                    className="absolute left-0 top-1/5 transform -translate-y-1/2 w-1 h-10 rounded-r-full"
                    style={{ 
                      backgroundColor: '#EAB308',
                      background: 'linear-gradient(180deg, #EAB308 0%, #FBBF24 100%)',
                      boxShadow: '0 0 10px rgba(234, 179, 8, 0.5)'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
                
                <div className={`p-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.href) 
                    ? 'bg-yellow-500/20' 
                    : 'group-hover:bg-yellow-500/10'
                }`}>
                  <item.icon
                    size={20}
                    style={{
                      color: isActive(item.href) 
                        ? '#EAB308' 
                        : '#22C55E'
                    }}
                  />
                </div>
                
                <AnimatePresence>
                  {isSidebarOpen && isLargeScreen && (
                    <motion.span
                      className="whitespace-nowrap ml-3 font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        color: isActive(item.href) ? '#EAB308' : '#FFFFFF'
                      }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {(!isSidebarOpen || !isLargeScreen) && (
                  <motion.div
                    className="absolute left-full ml-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-lg"
                    style={{
                      backgroundColor: '#111827',
                      color: '#EAB308',
                      border: '1px solid #EAB308',
                      backdropFilter: 'blur(10px)'
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.div>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t" style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          <AnimatePresence>
            {isSidebarOpen && isLargeScreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-xs" style={{ color: 'rgba(34, 197, 94, 0.7)' }}>
                  Vendor's Dashboard
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(34, 197, 94, 0.5)' }}>
                  v1.0.0
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;