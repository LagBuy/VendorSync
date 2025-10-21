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
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Overview",
    icon: BarChart2,
    color: "#FCE600",
    href: "/",
    description: "View your business dashboard",
    gradient: "from-yellow-400 to-yellow-600",
  },
  {
    name: "Products",
    icon: ShoppingBag,
    color: "#FFFFFF",
    href: "/products",
    description: "Manage your product catalog",
    gradient: "from-green-400 to-green-600",
  },
  {
    name: "Customers",
    icon: Users,
    color: "#FCE600",
    href: "/users",
    description: "View and manage customers",
    gradient: "from-yellow-400 to-yellow-600",
  },
  {
    name: "Sales",
    icon: DollarSign,
    color: "#FFFFFF",
    href: "/sales",
    description: "Track sales and revenue",
    gradient: "from-green-400 to-green-600",
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    color: "#FCE600",
    href: "/orders",
    description: "Process and manage orders",
    gradient: "from-yellow-400 to-yellow-600",
  },
  {
    name: "Analytics",
    icon: TrendingUp,
    color: "#FFFFFF",
    href: "/analytics",
    description: "Advanced business insights",
    gradient: "from-green-400 to-green-600",
  },
  {
    name: "Payment",
    icon: WalletCards,
    color: "#FCE600",
    href: "/payment",
    description: "Payment history and settings",
    gradient: "from-yellow-400 to-yellow-600",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "#FFFFFF",
    href: "/settings",
    description: "Account and business settings",
    gradient: "from-green-400 to-green-600",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activePulse, setActivePulse] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;

      setIsMobile(mobile);
      setIsTablet(tablet);

      if (mobile || tablet) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      setActivePulse(true);
      const timer = setTimeout(() => setActivePulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSidebarOpen]);

  const handleToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseMobile = () => {
    if (isMobile || isTablet) {
      setIsSidebarOpen(false);
    }
  };

  const isActive = (href) => location.pathname === href;

  const getHamburgerSize = () => {
    if (isMobile) return "small";
    if (isTablet) return "medium";
    return "large";
  };

  const hamburgerSize = getHamburgerSize();

  const QuantumFloatingButton = () => (
    <motion.button
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0, rotate: 180 }}
      className={`fixed z-50 rounded-2xl shadow-2xl ${
        hamburgerSize === "small"
          ? "top-6 left-6 w-14 h-14"
          : hamburgerSize === "medium"
          ? "top-7 left-7 w-16 h-16"
          : "top-8 left-8 w-18 h-18"
      }`}
      style={{
        background: `
          radial-gradient(circle at 30% 30%, rgba(252, 230, 0, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(165, 244, 213, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, rgba(26, 54, 43, 0.2) 0%, rgba(17, 36, 29, 0.3) 100%)
        `,
        backdropFilter: "blur(40px) saturate(200%)",
        border: "1px solid rgba(252, 230, 0, 0.4)",
        boxShadow: `
          0 25px 50px rgba(0, 0, 0, 0.25),
          0 0 80px rgba(252, 230, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2)
        `,
      }}
      whileHover={{
        scale: 1,
        rotate: 180,
        boxShadow: `
          0 15px 70px rgba(0, 0, 0, 0.35),
          0 0 100px rgba(252, 230, 0, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.4)
        `,
      }}
      whileTap={{
        scale: 0.9,
        rotate: 90,
      }}
      onClick={() => setIsSidebarOpen(true)}
    >
      <motion.div
        className="absolute inset-0 rounded-xl opacity-60"
        style={{
          background:
            "conic-gradient(from 0deg, #FCE600, #A5F4D5, #1A362B, #FCE600)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-1 rounded-sm bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <Menu
            size={
              hamburgerSize === "small"
                ? 24
                : hamburgerSize === "medium"
                ? 26
                : 28
            }
            className="text-yellow-400"
            style={{
              filter: "drop-shadow(0 0 10px rgba(252, 230, 0, 0.6))",
            }}
          />
        </motion.div>
      </div>

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          initial={{
            scale: 0,
            x: hamburgerSize === "small" ? 4 : 6,
            y: hamburgerSize === "small" ? 4 : 6,
          }}
          animate={{
            scale: [0, 1, 0],
            x: [
              hamburgerSize === "small" ? 4 : 6,
              hamburgerSize === "small" ? 16 : 20,
              hamburgerSize === "small" ? 4 : 6,
            ],
            y: [
              hamburgerSize === "small" ? 6 : 8,
              hamburgerSize === "small" ? -10 : -12,
              hamburgerSize === "small" ? 6 : 8,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.button>
  );

  if (!isSidebarOpen) {
    return <QuantumFloatingButton />;
  }

  if (isMobile || isTablet) {
    return (
      <>
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-green-900 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseMobile}
        />
        <motion.div
          className="fixed top-0 left-0 h-full z-50 lg:relative lg:z-10 transition-all duration-500 ease-out flex-shrink-0"
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          style={{
            width: 320,
            background: `
              radial-gradient(ellipse at top left, rgba(252, 230, 0, 0.15) 0%, transparent 60%),
              radial-gradient(ellipse at bottom right, rgba(165, 244, 213, 0.1) 0%, transparent 60%),
              linear-gradient(165deg, rgba(26, 54, 43, 0.95) 0%, rgba(17, 36, 29, 0.98) 100%)
            `,
            borderRight: "2px solid rgba(252, 230, 0, 0.3)",
            backdropFilter: "blur(60px) saturate(180%)",
            boxShadow: `
              0 0 100px rgba(252, 230, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          <SidebarContent
            isSidebarOpen={true}
            isMobile={isMobile}
            isTablet={isTablet}
            hamburgerSize={hamburgerSize}
            handleToggle={handleToggle}
            handleCloseMobile={handleCloseMobile}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            isActive={isActive}
            activePulse={activePulse}
          />
        </motion.div>
      </>
    );
  }

  return (
    <motion.div
      className="relative z-50 transition-all duration-500 ease-out flex-shrink-0 h-screen"
      animate={{
        width: isSidebarOpen ? 320 : 0,
        minWidth: isSidebarOpen ? 320 : 0,
      }}
      style={{
        background: `
          radial-gradient(ellipse at top left, rgba(252, 230, 0, 0.15) 0%, transparent 60%),
          radial-gradient(ellipse at bottom right, rgba(165, 244, 213, 0.1) 0%, transparent 60%),
          linear-gradient(165deg, rgba(26, 54, 43, 0.95) 0%, rgba(17, 36, 29, 0.98) 100%)
        `,
        borderRight: "2px solid rgba(252, 230, 0, 0.3)",
        backdropFilter: "blur(60px) saturate(180%)",
        boxShadow: `
          0 0 100px rgba(252, 230, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        overflow: "hidden",
      }}
    >
      <SidebarContent
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
        hamburgerSize={hamburgerSize}
        handleToggle={handleToggle}
        handleCloseMobile={handleCloseMobile}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
        isActive={isActive}
        activePulse={activePulse}
      />
    </motion.div>
  );
};

const SidebarContent = ({
  isSidebarOpen,
  isMobile,
  isTablet,
  hamburgerSize,
  handleToggle,
  handleCloseMobile,
  hoveredItem,
  setHoveredItem,
  isActive,
}) => {
  const getQuantumButtonStyle = () => ({
    background: `
      radial-gradient(circle at center, rgba(252, 230, 0, 0.2) 0%, transparent 70%),
      rgba(26, 54, 43, 0.15)
    `,
    backdropFilter: "blur(30px) saturate(180%)",
    border: "1.5px solid rgba(252, 230, 0, 0.3)",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 0 20px rgba(252, 230, 0, 0.2)
    `,
    ...(hamburgerSize === "small"
      ? {
          padding: "0.75rem",
          borderRadius: "16px",
        }
      : {
          padding: "0.875rem",
          borderRadius: "18px",
        }),
  });

  const getIconSize = () => {
    if (hamburgerSize === "small") return 20;
    if (hamburgerSize === "medium") return 22;
    return 24;
  };

  const quantumButtonStyle = getQuantumButtonStyle();
  const iconSize = getIconSize();

  return (
    <div className="h-full p-8 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: 80 + i * 40,
              height: 80 + i * 40,
              background: `radial-gradient(circle, rgba(252, 230, 0, 0.3) 0%, transparent 70%)`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-12 relative z-10">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.8 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(26, 54, 43, 0.9) 0%, rgba(17, 36, 29, 0.95) 100%)",
                    border: "2px solid rgba(252, 230, 0, 0.5)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(252, 230, 0, 0.3) 0%, transparent 70%)",
                    }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  <motion.span
                    className="text-2xl font-black text-yellow-400 relative z-10"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(252, 230, 0, 0.5)",
                        "0 0 20px rgba(252, 230, 0, 0.8)",
                        "0 0 10px rgba(252, 230, 0, 0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    LB
                  </motion.span>
                </div>

                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400"
                  animate={{
                    rotate: 360,
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity },
                  }}
                />
              </motion.div>

              <div>
                <motion.h1
                  className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 100%",
                  }}
                >
                  LAGBUY
                </motion.h1>
                <motion.p
                  className="text-sm mt-2 text-green-300 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
               
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center space-x-3">
          {(isMobile || isTablet) && (
            <motion.button
              whileHover={{
                scale: 1.1,
                rotate: 90,
                background: "rgba(252, 230, 0, 0.3)",
              }}
              whileTap={{
                scale: 0.9,
                rotate: 180,
              }}
              onClick={handleCloseMobile}
              style={quantumButtonStyle}
            >
              <X size={iconSize} className="text-yellow-400" />
            </motion.button>
          )}

          {!(isMobile || isTablet) && (
            <motion.button
              whileHover={{
                scale: 1.1,
                rotate: 180,
                background: "rgba(252, 230, 0, 0.3)",
              }}
              whileTap={{
                scale: 0.9,
                rotate: 90,
              }}
              onClick={handleToggle}
              style={quantumButtonStyle}
            >
              {isSidebarOpen ? (
                <ChevronLeft size={iconSize} className="text-yellow-400" />
              ) : (
                <ChevronRight size={iconSize} className="text-yellow-400" />
              )}
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow overflow-y-auto space-y-3 relative z-10"
          >
            {SIDEBAR_ITEMS.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  },
                }}
                whileHover={{
                  x: 10,
                  transition: { type: "spring", stiffness: 400 },
                }}
              >
                <Link
                  to={item.href}
                  onClick={() => (isMobile || isTablet) && handleCloseMobile()}
                >
                  <motion.div
                    className="group relative p-4 rounded-2xl transition-all duration-500 overflow-hidden"
                    onHoverStart={() => setHoveredItem(item.name)}
                    onHoverEnd={() => setHoveredItem(null)}
                    style={{
                      background: isActive(item.href)
                        ? `linear-gradient(135deg, rgba(252, 230, 0, 0.25) 0%, rgba(165, 244, 213, 0.15) 100%)`
                        : hoveredItem === item.name
                        ? `linear-gradient(135deg, rgba(252, 230, 0, 0.15) 0%, rgba(165, 244, 213, 0.1) 100%)`
                        : `rgba(255, 255, 255, 0.05)`,
                      backdropFilter: "blur(20px)",
                      border: isActive(item.href)
                        ? "2px solid rgba(252, 230, 0, 0.6)"
                        : hoveredItem === item.name
                        ? "1px solid rgba(252, 230, 0, 0.3)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: isActive(item.href)
                        ? "0 20px 40px rgba(252, 230, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                        : hoveredItem === item.name
                        ? "0 15px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                        : "0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                    }}
                    whileHover={{
                      scale: 1.02,
                      y: -2,
                    }}
                  >
                    {isActive(item.href) && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-yellow-400"
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{
                          opacity: [0, 0.8, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}20, transparent 50%)`,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="flex items-center space-x-4 relative z-10">
                      <motion.div
                        className={`p-3 rounded-xl ${
                          isActive(item.href)
                            ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                            : "bg-white/5 group-hover:bg-white/10"
                        }`}
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                        }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <item.icon
                          size={24}
                          className={
                            isActive(item.href)
                              ? "text-white drop-shadow-lg"
                              : "text-current"
                          }
                          style={{
                            color: isActive(item.href) ? "#FFFFFF" : item.color,
                            filter: isActive(item.href)
                              ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                              : "none",
                          }}
                        />
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <motion.div
                          className={`font-bold text-lg ${
                            isActive(item.href)
                              ? "text-yellow-400"
                              : "text-white"
                          }`}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {item.name}
                        </motion.div>
                        <motion.div
                          className={`text-sm mt-1 ${
                            isActive(item.href)
                              ? "text-yellow-200"
                              : "text-green-300"
                          }`}
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {item.description}
                        </motion.div>
                      </div>

                      {isActive(item.href) && (
                        <motion.div
                          className="w-2 h-2 bg-yellow-400 rounded-full ml-2"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="mt-auto pt-8 border-t border-green-700/30 relative z-10"
          >
            <div className="text-center space-y-3">
              <motion.div
                className="w-16 h-1 rounded-full mx-auto mb-4"
                style={{
                  background:
                    "linear-gradient(90deg, #FCE600, #A5F4D5, #FCE600)",
                  backgroundSize: "200% 100%",
                }}
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <motion.p
                className="text-sm font-semibold text-green-300"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(165, 244, 213, 0.5)",
                    "0 0 20px rgba(165, 244, 213, 0.8)",
                    "0 0 10px rgba(165, 244, 213, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Thanks For Joining Us 💝
              </motion.p>
              <motion.p
                className="text-xs text-green-400 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Zap size={12} className="text-yellow-400" />
                <span>First Edition</span>
                <Sparkles size={12} className="text-yellow-400" />
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
