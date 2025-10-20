import { useState, useEffect } from "react";
import { User, Sparkles, Edit3, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axios-instance/axios-instance";
import Cookies from "js-cookie";
import SettingSection from "./SettingSection";

const Profile = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    email: "",
    gender: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Generate random avatar using DiceBear Avataaars
  const getAvatarUrl = (gender) => {
    const seed = Math.random().toString(36).substring(2);
    const baseUrl = "https://api.dicebear.com/7.x/avataaars/svg";
    const avatarUrl = `${baseUrl}?seed=${seed}`;
    console.log("Generated Avatar URL:", avatarUrl, "Gender:", gender);
    return avatarUrl;
  };

  // Fallback image URL
  const fallbackAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("jwt-token");
        console.log("JWT Token:", token ? "Present" : "Missing");
        const { data } = await axiosInstance.get("/auth/user/");
        console.log("Full API Response:", data);
        console.log("User Profile:", data.user_profile);
        console.log("Gender:", data.user_profile?.gender);

        if (data.email && data.user_profile) {
          setUserData({
            first_name: data.user_profile.first_name || "",
            email: data.email || "",
            gender: data.user_profile.gender || "",
            image: data.user_profile.image || null,
          });
          toast.success("Profile data loaded successfully!", {
            className: "custom-toast-success"
          });
        } else {
          throw new Error("Incomplete user data received");
        }
      } catch (error) {
        console.error("Fetch user data error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.detail || "Failed to load profile data. Please ensure you are logged in.",
          { className: "custom-toast-error" }
        );
        setUserData({
          first_name: "",
          email: "",
          gender: "",
          image: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SettingSection 
      icon={User} 
      title=""
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm"
    >
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <User className="mr-3 text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-white">Profile Information</h2>
        </div>
        {!isLoading && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Active</span>
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-6">
        {/* Avatar Section */}
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative">
            <img
              src={userData.image || getAvatarUrl(userData.gender)}
              alt="Profile Avatar"
              className="rounded-2xl w-32 h-32 object-cover border-2 border-yellow-500/50 shadow-lg"
              onLoad={() => console.log("Avatar image loaded successfully")}
              onError={(e) => {
                console.error("Avatar image failed to load:", e);
                e.target.src = fallbackAvatar;
              }}
            />
            {/* Edit Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          {/* Status Indicator */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 border-2 border-gray-900 rounded-full"></div>
        </motion.div>

        {/* User Info */}
        <div className="flex-1 text-center lg:text-left">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="h-8 bg-gray-800 rounded-lg animate-pulse w-48 mx-auto lg:mx-0"></div>
                <div className="h-6 bg-gray-800 rounded-lg animate-pulse w-64 mx-auto lg:mx-0"></div>
                <div className="h-4 bg-gray-800 rounded-lg animate-pulse w-32 mx-auto lg:mx-0"></div>
              </motion.div>
            ) : (
              <motion.div
                key="loaded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h3 className="text-2xl font-bold text-white">
                  {userData.first_name || "Not Available"}
                </h3>
                <p className="text-green-500 text-lg font-semibold flex items-center justify-center lg:justify-start">
                  <User size={16} className="mr-2" />
                  {userData.email || "Not Available"}
                </p>
                {userData.gender && (
                  <p className="text-gray-400 text-sm bg-gray-800/50 rounded-lg px-3 py-1 inline-block">
                    {userData.gender}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <motion.button 
          className="flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 size={18} className="mr-2" />
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </motion.button>
        
        <motion.button 
          className="flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-3 px-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 shadow-lg flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Camera size={18} className="mr-2" />
          Change Photo
        </motion.button>
      </div>

      {/* Edit Form (Conditional) */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">First Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:outline-none transition-colors duration-300"
                  placeholder="Enter first name"
                  defaultValue={userData.first_name}
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:outline-none transition-colors duration-300"
                  placeholder="Enter email"
                  defaultValue={userData.email}
                />
              </div>
            </div>
            
            <motion.button 
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </SettingSection>
  );
};

export default Profile;