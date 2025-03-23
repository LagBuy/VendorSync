import { useState } from "react";
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

  return (
    <SettingSection icon={Bell} title={"Notifications"}>
      <ToggleSwitch
        label={"Push Notifications"}
        isOn={notifications.push}
        onToggle={() =>
          setNotifications({ ...notifications, push: !notifications.push })
        }
      />
      <ToggleSwitch
        label={"Email Notifications"}
        isOn={notifications.email}
        onToggle={() =>
          setNotifications({ ...notifications, email: !notifications.email })
        }
      />
      <ToggleSwitch
        label={"SMS Notifications"}
        isOn={notifications.sms}
        onToggle={() =>
          setNotifications({ ...notifications, sms: !notifications.sms })
        }
      />
      <ToggleSwitch
        label={"WhatsApp Notifications"}
        isOn={notifications.whatsapp}
        onToggle={() =>
          setNotifications({
            ...notifications,
            whatsapp: !notifications.whatsapp,
          })
        }
      />

      <ToggleSwitch
        label={"WhatsApp Business Notifications"}
        isOn={notifications.whatsappb}
        onToggle={() =>
          setNotifications({
            ...notifications,
            whatsappb: !notifications.whatsappb,
          })
        }
      />
    </SettingSection>
  );
};
export default Notifications;
