import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { Lock, Shield, Camera, Scan, Sparkles, CheckCircle } from "lucide-react";
import SettingSection from "./SettingSection";
import Modal from "antd/es/modal/Modal";
import ChangePassword from "./ChangePassword";

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [password, setPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isFaceScanned, setIsFaceScanned] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Security features with icons and descriptions
  const securityFeatures = [
    {
      key: "twoFactor",
      label: "Two-Factor Authentication",
      description: "Add an extra layer of security with biometric verification",
      icon: Shield,
      color: "#EAB308"
    }
  ];

  // Fetch 2FA status on mount
  useEffect(() => {
    const fetchTwoFactorStatus = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/two-factor");
        setTwoFactor(data.enabled ?? false);
        setIsFaceScanned(data.enabled ?? false);
        toast.success("Security settings loaded successfully!", {
          className: "custom-toast-success"
        });
      } catch (error) {
        console.error("Error fetching 2FA status:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load security settings.", {
          className: "custom-toast-error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTwoFactorStatus();
  }, []);

  // Start face scan by accessing camera
  const startFaceScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
      toast.error("Failed to access camera for face scan.", {
        className: "custom-toast-error"
      });
      setIsScanning(false);
    }
  };

  // Stop face scan and finalize the process
  const stopFaceScan = async () => {
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
    setIsScanning(false);

    if (capturedImage) {
      setSaving(true);
      try {
        await axiosInstance.post("/face-scan", { image: capturedImage });
        setIsFaceScanned(true);
        toast.success("Face scan completed successfully!", {
          className: "custom-toast-success"
        });
      } catch (error) {
        console.error("Error uploading face scan:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to upload face scan.", {
          className: "custom-toast-error"
        });
        setTwoFactor(false);
      } finally {
        setSaving(false);
      }
    } else {
      toast.error("Please capture a face image before completing the scan.", {
        className: "custom-toast-error"
      });
      setTwoFactor(false);
    }
  };

  // Capture image from video stream
  const captureFace = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL("image/png");
      setCapturedImage(image);
      toast.success("Face captured successfully!", {
        className: "custom-toast-success"
      });
    }
  };

  // Update 2FA status
  const handleTwoFactorToggle = async () => {
    const newTwoFactor = !twoFactor;
    setTwoFactor(newTwoFactor);
    
    if (newTwoFactor) {
      startFaceScan();
    } else {
      setSaving(true);
      try {
        await axiosInstance.patch("/two-factor", { enabled: false });
        setIsFaceScanned(false);
        setCapturedImage(null);
        toast.success("2FA disabled successfully!", {
          className: "custom-toast-success"
        });
      } catch (error) {
        console.error("Error updating 2FA status:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to update 2FA status.", {
          className: "custom-toast-error"
        });
        setTwoFactor(true);
      } finally {
        setSaving(false);
      }
    }
  };

  // Effect to automatically stop scanning when 2FA is turned off
  useEffect(() => {
    if (!twoFactor && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => track.stop());
      setIsScanning(false);
    }
  }, [twoFactor]);

  // Custom Toggle Switch Component
  const SecurityToggleSwitch = ({ label, description, isOn, onToggle, disabled, icon: Icon, color }) => (
    <motion.div 
      className="flex items-center justify-between p-6 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300"
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
          isOn ? 'bg-green-500' : 'bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.span
          className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-lg ${
            isOn ? 'translate-x-8' : 'translate-x-1'
          }`}
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </motion.div>
  );

  return (
    <>
      <SettingSection 
        icon={Lock} 
        title="Security Center"
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Lock className="mr-3 text-yellow-500" size={24} />
            <h2 className="text-xl font-bold text-white">Security Settings</h2>
          </div>
          {!loading && (
            <div className="flex items-center text-green-500 text-sm">
              <Sparkles size={16} className="mr-1" />
              <span>Protected</span>
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
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-6 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/50 to-black/50">
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
              className="space-y-6"
            >
              {/* 2FA Toggle */}
              {securityFeatures.map((feature) => (
                <SecurityToggleSwitch
                  key={feature.key}
                  label={feature.label}
                  description={feature.description}
                  isOn={twoFactor}
                  onToggle={handleTwoFactorToggle}
                  disabled={saving}
                  icon={feature.icon}
                  color={feature.color}
                />
              ))}

              {/* Change Password Button */}
              <motion.button
                className="flex items-center justify-center w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-4 px-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPassword(true)}
                disabled={saving}
              >
                <Lock size={18} className="mr-2" />
                Change Password
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Face Scan Section */}
        <AnimatePresence>
          {twoFactor && !isFaceScanned && isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 p-6 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-black/50 backdrop-blur-sm"
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <Scan className="text-yellow-500 mr-2" size={24} />
                  <h4 className="text-yellow-500 text-lg font-semibold">
                    Face Scan for 2FA
                  </h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Please align your face within the frame to enable two-factor authentication.
                </p>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="relative bg-black rounded-2xl p-4 border border-gray-700">
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full h-64 lg:h-80 object-cover rounded-xl"
                    ></video>
                    <div className="absolute inset-0 border-2 border-yellow-500/50 rounded-xl pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <motion.button
                    onClick={captureFace}
                    className="flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={saving}
                  >
                    <Camera size={18} className="mr-2" />
                    Capture Face
                  </motion.button>
                  
                  <motion.button
                    onClick={stopFaceScan}
                    className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={saving || !capturedImage}
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Complete Setup
                  </motion.button>
                </div>
              </div>
              
              <canvas
                ref={canvasRef}
                style={{ display: "none" }}
              ></canvas>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Display Captured Image */}
        <AnimatePresence>
          {capturedImage && !isFaceScanned && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-6 text-center rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-black/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                <h4 className="text-green-500 font-semibold text-lg">
                  Face Captured Successfully!
                </h4>
              </div>
              <img
                src={capturedImage}
                alt="Captured Face"
                className="w-32 h-32 object-cover rounded-full border-2 border-green-500 mx-auto"
              />
              <p className="text-gray-400 text-sm mt-3">
                This is your captured face for 2FA authentication.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {isFaceScanned && twoFactor && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 text-center rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-black/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center mb-3">
                <Shield className="text-green-500 mr-2" size={24} />
                <h4 className="text-green-500 font-semibold text-lg">
                  Biometric Security Active!
                </h4>
              </div>
              <p className="text-gray-400 text-sm">
                Two-factor authentication with face recognition is now enabled and protecting your account.
              </p>
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
                <span className="text-yellow-500 text-sm font-medium">Updating security settings...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Summary */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-800"
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-sm">2FA Status</p>
                <p className={`font-bold text-lg ${
                  twoFactor ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {twoFactor ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Face Scan</p>
                <p className={`font-bold text-lg ${
                  isFaceScanned ? 'text-green-500' : 'text-gray-400'
                }`}>
                  {isFaceScanned ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </SettingSection>

      {/* Password Change Modal */}
      <Modal
        open={password}
        onCancel={() => setPassword(false)}
        footer={null}
        className="security-modal"
        styles={{
          body: {
            background: 'linear-gradient(135deg, #111827 0%, #000000 100%)',
            borderRadius: '24px',
            padding: '0'
          }
        }}
      >
        <div className="p-8">
          <ChangePassword onClose={() => setPassword(false)} />
        </div>
      </Modal>

      {/* Custom Modal Styles */}
      <style>{`
        .security-modal .ant-modal-content {
          background: transparent;
          border: 1px solid rgba(234, 179, 8, 0.3);
          border-radius: 24px;
          backdrop-filter: blur(10px);
        }
        .security-modal .ant-modal-close {
          color: #EAB308;
        }
        .security-modal .ant-modal-close:hover {
          color: #FBBF24;
        }
      `}</style>
    </>
  );
};

export default Security;