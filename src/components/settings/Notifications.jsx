import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    whatsapp: true,
    whatsappb: false,
  });
  const [loading, setLoading] = useState(false);

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
        toast.success("Notification settings loaded successfully!");
      } catch (error) {
        console.error("Error fetching notification settings:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load notification settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleToggle = async (key) => {
    const updatedNotifications = { ...notifications, [key]: !notifications[key] };
    setLoading(true);
    try {
      await axiosInstance.patch("/notification-settings", updatedNotifications);
      setNotifications(updatedNotifications);
      toast.success("Notification settings updated successfully!");
    } catch (error) {
      console.error("Error updating notification settings:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to update notification settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingSection icon={Bell} title={"Notifications"}>
      <ToggleSwitch
        label={"Push Notifications"}
        isOn={notifications.push}
        onToggle={() => handleToggle("push")}
        disabled={loading}
      />
      <ToggleSwitch
        label={"Email Notifications"}
        isOn={notifications.email}
        onToggle={() => handleToggle("email")}
        disabled={loading}
      />
      <ToggleSwitch
        label={"SMS Notifications"}
        isOn={notifications.sms}
        onToggle={() => handleToggle("sms")}
        disabled={loading}
      />
      <ToggleSwitch
        label={"WhatsApp Notifications"}
        isOn={notifications.whatsapp}
        onToggle={() => handleToggle("whatsapp")}
        disabled={loading}
      />
      <ToggleSwitch
        label={"WhatsApp Business Notifications"}
        isOn={notifications.whatsappb}
        onToggle={() => handleToggle("whatsappb")}
        disabled={loading}
      />
    </SettingSection>
  );
};

export default Notifications;