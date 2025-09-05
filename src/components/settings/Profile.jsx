import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import Cookies from "js-cookie"; // Added for debugging JWT token
import SettingSection from "./SettingSection";

const Profile = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    email: "",
    gender: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Generate random avatar using DiceBear Avataaars
  const getAvatarUrl = (gender) => {
    const seed = Math.random().toString(36).substring(2); // Random seed
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
        console.log("JWT Token:", token ? "Present" : "Missing"); // Debug token
        const { data } = await axiosInstance.get("/auth/user/");
        console.log("Full API Response:", data); // Debug full response
        console.log("User Profile:", data.user_profile); // Debug user_profile
        console.log("Gender:", data.user_profile?.gender); // Debug gender

        if (data.email && data.user_profile) {
          setUserData({
            first_name: data.user_profile.first_name || "",
            email: data.email || "",
            gender: data.user_profile.gender || "",
            image: data.user_profile.image || null,
          });
          toast.success("Profile data loaded successfully!");
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
          error.response?.data?.detail || "Failed to load profile data. Please ensure you are logged in."
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
    <SettingSection icon={User} title={"Profile"}>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <img
          src={userData.image || getAvatarUrl(userData.gender)}
          alt="Profile Avatar"
          className="rounded-full w-20 h-20 object-cover mr-4"
          onLoad={() => console.log("Avatar image loaded successfully")} // Debug load
          onError={(e) => {
            console.error("Avatar image failed to load:", e);
            e.target.src = fallbackAvatar; // Fallback avatar
          }}
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-100">
            {isLoading ? "Loading..." : userData.first_name || "Not available"}
          </h3>
          <p className="text-gray-400">
            {isLoading ? "Loading..." : userData.email || "Not available"}
          </p>
        </div>
      </div>

      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto">
        Edit Profile
      </button>
    </SettingSection>
  );
};

export default Profile;