import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axios-instance/axios-instance";
import SettingSection from "./SettingSection";
import {
  Bell,
  Sparkles,
  Volume2,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    whatsapp: true,
    whatsappb: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Notification types with icons and descriptions
  const notificationTypes = [
    {
      key: "push",
      label: "Push Notifications",
      description: "Receive real-time alerts in your browser",
      icon: Bell,
      color: "#EAB308",
    },
    {
      key: "email",
      label: "Email Notifications",
      description: "Get updates delivered to your inbox",
      icon: Mail,
      color: "#22C55E",
    },
    {
      key: "sms",
      label: "SMS Notifications",
      description: "Text message alerts for urgent updates",
      icon: MessageSquare,
      color: "#3B82F6",
    },
    {
      key: "whatsapp",
      label: "WhatsApp Notifications",
      description: "Instant messages for order updates",
      icon: Smartphone,
      color: "#25D366",
    },
    {
      key: "whatsappb",
      label: "WhatsApp Business",
      description: "Professional business messaging",
      icon: Volume2,
      color: "#075E54",
    },
  ];

  // Fetch notification settings on mount
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/notification-settings");
        setNotifications({
          push: data.push ?? notifications.push,
          email: data.email ?? notifications.email,
          sms: data.sms ?? notifications.sms,
          whatsapp: data.whatsapp ?? notifications.whatsapp,
          whatsappb: data.whatsappb ?? notifications.whatsappb,
        });
      } catch (error) {
        console.error("Error fetching notification settings:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleToggle = async (key) => {
    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key],
    };
    setNotifications(updatedNotifications);
    setSaving(true);

    try {
      await axiosInstance.patch("/notification-settings", updatedNotifications);
    } catch (error) {
      console.error("Error updating notification settings:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      // Revert on error
      setNotifications(notifications);
    } finally {
      setSaving(false);
    }
  };

  // Custom Toggle Switch Component
  const ToggleSwitch = ({
    label,
    description,
    isOn,
    onToggle,
    disabled,
    icon: Icon,
    color,
  }) => (
    <motion.div
      className="flex items-center justify-between p-4 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-4">
        <div
          className="p-3 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">{label}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>

      <button
        onClick={onToggle}
        disabled={disabled || saving}
        className={`relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-300 ease-in-out focus:outline-none ${
          isOn ? "bg-green-500" : "bg-gray-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <motion.span
          className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-lg ${
            isOn ? "translate-x-8" : "translate-x-1"
          }`}
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </motion.div>
  );

  return (
    <SettingSection
      icon={Bell}
      title="Notification Preferences"
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Bell className="mr-3 text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-white">
            Notification Settings
          </h2>
        </div>
        {!loading && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Customizable</span>
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
            {[...Array(5)].map((_, index) => (
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
                <div className="w-14 h-7 bg-gray-800 rounded-full animate-pulse"></div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {notificationTypes.map((type) => (
              <ToggleSwitch
                key={type.key}
                label={type.label}
                description={type.description}
                isOn={notifications[type.key]}
                onToggle={() => handleToggle(type.key)}
                disabled={saving}
                icon={type.icon}
                color={type.color}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saving Indicator */}
      <AnimatePresence>
        {saving && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/30 rounded-2xl"
          >
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full mr-3"
              />
              <span className="text-yellow-500 text-sm font-medium">
                Saving your preferences...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-gray-800"
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Active Channels</p>
              <p className="text-yellow-500 font-bold text-lg">
                {Object.values(notifications).filter(Boolean).length}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Options</p>
              <p className="text-green-500 font-bold text-lg">
                {notificationTypes.length}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </SettingSection>
  );
};

export default Notifications;
