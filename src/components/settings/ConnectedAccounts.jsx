import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import SettingSection from "./SettingSection";
import { HelpCircle } from "lucide-react";

const ConnectedAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      name: "Google",
      connected: true,
      icon: "/google.png",
      url: "https://google.com",
    },
    {
      id: 2,
      name: "Facebook",
      connected: false,
      icon: "/facebook.svg",
      url: "",
    },
    {
      id: 3,
      name: "Twitter",
      connected: false,
      icon: "/x.png",
      url: "",
    },
    {
      id: 4,
      name: "Instagram",
      connected: false,
      icon: "/instagram.avif",
      url: "",
    },
    {
      id: 5,
      name: "Tiktok",
      connected: false,
      icon: "/Tiktok.webp",
      url: "",
    },
    {
      id: 6,
      name: "WhatsApp",
      connected: false,
      icon: "/WhatsApp.png",
      url: "",
    },
    {
      id: 7,
      name: "WhatsApp-B",
      connected: false,
      icon: "/WhatsAppB.png",
      url: "",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch connected accounts on mount
  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/linked-accounts");
        // Map API data to component state format
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
        toast.success("Connected accounts loaded successfully!");
      } catch (error) {
        console.error("Error fetching connected accounts:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load connected accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnectedAccounts();
  }, []);

  const handleToggle = async (account) => {
    // Don't open modal for Google
    if (account.name === "Google") return;

    if (!account.connected) {
      setActiveAccount(account);
      setShowModal(true);
    } else {
      setLoading(true);
      try {
        await axiosInstance.delete(`/linked-accounts/${account.name.toLowerCase()}`);
        setConnectedAccounts(
          connectedAccounts.map((acc) =>
            acc.id === account.id ? { ...acc, connected: false, url: "" } : acc
          )
        );
        toast.success(`${account.name} account disconnected successfully!`);
      } catch (error) {
        console.error("Error disconnecting account:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || `Failed to disconnect ${account.name} account.`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveUrl = async () => {
    // Validate URL
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

    setLoading(true);
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
      toast.success(`${activeAccount.name} account connected successfully!`);
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
      toast.error(error.response?.data?.message || `Failed to connect ${activeAccount.name} account.`);
    } finally {
      setLoading(false);
    }
  };

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
            } transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleToggle(account)}
            disabled={loading}
          >
            {account.connected ? "🔐" : "🔓"}
          </button>
        </div>
      ))}

      {/* Customer Service button */}
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4">
        <a href="#">Customer Service 🗨️</a>
      </button>

      {/* Modal for linking account */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-2">
              Link {activeAccount?.name} Account
            </h2>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setError("");
              }}
              placeholder="Paste your social media URL here"
              className="w-full border border-gray-300 p-2 rounded mb-2"
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setInputUrl("");
                  setError("");
                  setActiveAccount(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUrl}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingSection>
  );
};

export default ConnectedAccounts;