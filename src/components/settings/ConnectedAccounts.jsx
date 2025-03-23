import { useState } from "react";
import SettingSection from "./SettingSection";
import { HelpCircle } from "lucide-react";

const ConnectedAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      name: "Google",
      connected: true,
      icon: "/google.png",
    },
    {
      id: 2,
      name: "Facebook",
      connected: false,
      icon: "/facebook.svg",
    },
    {
      id: 3,
      name: "Twitter",
      connected: false,
      icon: "/x.png",
    },
    {
      id: 4,
      name: "Instagram",
      connected: false,
      icon: "/instagram.avif",
    },
    {
      id: 5,
      name: "Tiktok",
      connected: false,
      icon: "/Tiktok.webp",
    },

    {
      id: 6,
      name: "WhatsApp",
      connected: false,
      icon: "/WhatsApp.png",
    },

    {
      id: 7,
      name: "WhatsApp-B",
      connected: false,
      icon: "/WhatsAppB.png",
    },
  ]);

  return (
    <SettingSection icon={HelpCircle} title={"Linked Accounts"}>
      {connectedAccounts.map((account) => (
        <div
          key={account.id}
          className="flex items-center justify-between py-3"
        >
          <div className="flex gap-1">
            <img
              src={account.icon}
              alt="Social img"
              className="size-6 object-cover rounded-full mr-2"
            />
            <span className="text-gray-300">{account.name}</span>
          </div>
          <button
            className={`px-3 py-1 rounded ${
              account.connected
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            } transition duration-200`}
            onClick={() => {
              setConnectedAccounts(
                connectedAccounts.map((acc) => {
                  if (acc.id === account.id) {
                    return {
                      ...acc,
                      connected: !acc.connected,
                    };
                  }
                  return acc;
                })
              );
            }}
          >
            {account.connected ? "🔐" : "🔓"}
          </button>
        </div>
      ))}

      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold py-2 px-4 rounded 
        transition duration-200 
        "
      >
        <a href="">Customer Service 🗨️</a>
      </button>
    </SettingSection>
  );
};

export default ConnectedAccounts;
