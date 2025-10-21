import { useState, useEffect, useRef } from "react";
import { User, Sparkles, Edit3, Camera, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axios-instance/axios-instance";
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/user/");

        if (data.email && data.user_profile) {
          setUserData({
            first_name: data.user_profile.first_name || "",
            email: data.email || "",
            gender: data.user_profile.gender || "",
            image: data.user_profile.image || null,
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

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const { data } = await axiosInstance.put('/auth/user/profile/image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user data with new image
      setUserData(prev => ({
        ...prev,
        image: data.image_url || data.user_profile?.image
      }));

      // Reset states
      setSelectedImage(null);
      setImagePreview(null);
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <SettingSection 
      icon={User} 
      title=""
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm"
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        className="hidden"
      />

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
            {userData.image || imagePreview ? (
              <img
                src={imagePreview || userData.image}
                alt="Profile Avatar"
                className="rounded-2xl w-32 h-32 object-cover border-2 border-yellow-500/50 shadow-lg"
              />
            ) : (
              <div className="rounded-2xl w-32 h-32 border-2 border-yellow-500/50 shadow-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <User className="text-yellow-500" size={48} />
              </div>
            )}
            
            {/* Edit Overlay */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={triggerFileInput}
            >
              <Camera className="text-white" size={24} />
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 border-2 border-gray-900 rounded-full"></div>

          {/* Upload Progress Indicator */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
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

      {/* Image Upload Controls */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-yellow-500 font-semibold text-sm">New Photo Selected</h4>
            <button
              onClick={handleCancelUpload}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={handleUploadImage}
              disabled={uploading}
              className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:from-green-400 hover:to-green-500 transition-all duration-300 disabled:opacity-50 flex-1"
              whileHover={{ scale: uploading ? 1 : 1.02 }}
              whileTap={{ scale: uploading ? 1 : 0.98 }}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Save Photo
                </>
              )}
            </motion.button>
            <motion.button
              onClick={handleCancelUpload}
              className="flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-2 px-4 rounded-lg text-sm hover:from-gray-600 hover:to-gray-700 transition-all duration-300 border border-gray-600 flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X size={16} className="mr-2" />
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

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
          onClick={triggerFileInput}
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