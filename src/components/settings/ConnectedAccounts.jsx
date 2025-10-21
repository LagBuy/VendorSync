import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axios-instance/axios-instance";
import SettingSection from "./SettingSection";
import {
  HelpCircle,
  Link,
  Unlink,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Shield,
} from "lucide-react";

const ConnectedAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      name: "Google",
      connected: true,
      icon: "/google.png",
      url: "https://google.com",
      color: "#4285F4",
      description: "Connect your Google account for seamless authentication",
    },
    {
      id: 2,
      name: "Facebook",
      connected: false,
      icon: "/facebook.svg",
      url: "",
      color: "#1877F2",
      description: "Link Facebook for social media integration",
    },
    {
      id: 3,
      name: "Twitter",
      connected: false,
      icon: "/x.png",
      url: "",
      color: "#000000",
      description: "Connect Twitter for social sharing",
    },
    {
      id: 4,
      name: "Instagram",
      connected: false,
      icon: "/instagram.avif",
      url: "",
      color: "#E4405F",
      description: "Link Instagram for media integration",
    },
    {
      id: 5,
      name: "TikTok",
      connected: false,
      icon: "/Tiktok.webp",
      url: "",
      color: "#000000",
      description: "Connect TikTok for video content",
    },
    {
      id: 6,
      name: "WhatsApp",
      connected: false,
      icon: "/WhatsApp.png",
      url: "",
      color: "#25D366",
      description: "Link WhatsApp for messaging",
    },
    {
      id: 7,
      name: "WhatsApp Business",
      connected: false,
      icon: "/WhatsAppB.png",
      url: "",
      color: "#075E54",
      description: "Connect WhatsApp Business for professional messaging",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch connected accounts on mount
  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/linked-accounts");
        const updatedAccounts = connectedAccounts.map((acc) => {
          const apiAccount = data.find(
            (apiAcc) => apiAcc.platform.toLowerCase() === acc.name.toLowerCase()
          );
          return apiAccount
            ? {
                ...acc,
                connected: apiAccount.connected,
                url: apiAccount.url || "",
              }
            : acc;
        });
        setConnectedAccounts(updatedAccounts);
      } catch (error) {
        console.error("Error fetching connected accounts:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConnectedAccounts();
  }, []);

  const handleToggle = async (account) => {
    if (account.name === "Google") return;

    if (!account.connected) {
      setActiveAccount(account);
      setShowModal(true);
    } else {
      setSaving(true);
      try {
        await axiosInstance.delete(
          `/linked-accounts/${account.name.toLowerCase()}`
        );
        setConnectedAccounts(
          connectedAccounts.map((acc) =>
            acc.id === account.id ? { ...acc, connected: false, url: "" } : acc
          )
        );
      } catch (error) {
        console.error("Error disconnecting account:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSaveUrl = async () => {
    const trimmedUrl = inputUrl.trim();
    const isValidUrl = /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(trimmedUrl);

    if (!trimmedUrl) {
      setError("Please enter a URL.");
      return;
    }

    if (!isValidUrl) {
      setError(
        "Please enter a valid URL (must start with http:// or https://)."
      );
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.post("/linked-accounts", {
        platform: activeAccount.name.toLowerCase(),
        url: trimmedUrl,
      });
      setConnectedAccounts(
        connectedAccounts.map((acc) =>
          acc.id === activeAccount.id
            ? { ...acc, connected: true, url: trimmedUrl }
            : acc
        )
      );
      setShowModal(false);
      setInputUrl("");
      setActiveAccount(null);
      setError("");
    } catch (error) {
      console.error("Error connecting account:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // Custom Account Card Component
  const AccountCard = ({ account }) => (
    <motion.div
      className="flex items-center justify-between p-4 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-4">
        <div
          className="p-3 rounded-xl flex items-center justify-center border border-gray-700"
          style={{ backgroundColor: `${account.color}20` }}
        >
          <img
            src={account.icon}
            alt={account.name}
            className="w-6 h-6 object-cover"
          />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">{account.name}</h3>
          <p className="text-gray-400 text-sm">{account.description}</p>
          {account.connected && account.url && (
            <p className="text-green-500 text-xs mt-1 flex items-center">
              <ExternalLink size={12} className="mr-1" />
              Connected
            </p>
          )}
        </div>
      </div>

      <motion.button
        onClick={() => handleToggle(account)}
        disabled={saving || account.name === "Google"}
        className={`flex items-center justify-center w-20 py-2 rounded-xl font-semibold transition-all duration-300 ${
          account.connected
            ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500"
            : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 border border-gray-600"
        } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        whileHover={{ scale: account.name === "Google" ? 1 : 1.05 }}
        whileTap={{ scale: account.name === "Google" ? 1 : 0.95 }}
      >
        {account.connected ? (
          <>
            <Unlink size={16} className="mr-1" />
            Unlink
          </>
        ) : (
          <>
            <Link size={16} className="mr-1" />
            Link
          </>
        )}
      </motion.button>
    </motion.div>
  );

  return (
    <SettingSection
      icon={HelpCircle}
      title="Connected Accounts"
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <HelpCircle className="mr-3 text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-white">Linked Accounts</h2>
        </div>
        {!loading && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Integration</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/50 to-black/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-800 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded w-48 animate-pulse"></div>
                  </div>
                </div>
                <div className="w-20 h-10 bg-gray-800 rounded-xl animate-pulse"></div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {connectedAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Service Button */}
      <motion.button
        className="flex items-center justify-center w-full mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <MessageCircle size={18} className="mr-2" />
        Customer Service Support
      </motion.button>

      {/* Summary Stats */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-gray-800"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Total Platforms</p>
              <p className="text-yellow-500 font-bold text-lg">
                {connectedAccounts.length}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Connected</p>
              <p className="text-green-500 font-bold text-lg">
                {connectedAccounts.filter((acc) => acc.connected).length}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Available</p>
              <p className="text-gray-400 font-bold text-lg">
                {connectedAccounts.filter((acc) => !acc.connected).length}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal for linking account */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-yellow-500/30 shadow-2xl w-96"
            >
              <div className="flex items-center mb-6">
                <Shield className="text-yellow-500 mr-3" size={24} />
                <h2 className="text-xl font-bold text-white">
                  Link {activeAccount?.name} Account
                </h2>
              </div>

              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">
                  Enter your {activeAccount?.name} profile URL
                </label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    setError("");
                  }}
                  placeholder="https://example.com/your-profile"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:outline-none transition-colors duration-300"
                  disabled={saving}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center"
                  >
                    <Shield size={14} className="mr-1" />
                    {error}
                  </motion.p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <motion.button
                  onClick={() => {
                    setShowModal(false);
                    setInputUrl("");
                    setError("");
                    setActiveAccount(null);
                  }}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 border border-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={saving}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSaveUrl}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"
                      />
                      Connecting...
                    </div>
                  ) : (
                    "Connect Account"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SettingSection>
  );
};

export default ConnectedAccounts;
