import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { 
  CheckCircle, 
  Shield, 
  Upload, 
  FileText, 
  Camera, 
  Sparkles, 
  AlertCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";

const VerifyPage = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [frontProgress, setFrontProgress] = useState(0);
  const [backProgress, setBackProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const documentOptions = [
    {
      name: "Driver's License",
      icon: FileText,
      color: "#EAB308",
      description: "Government-issued driver's license"
    },
    {
      name: "International Passport",
      icon: Shield,
      color: "#22C55E",
      description: "Valid passport with photo"
    },
    {
      name: "NIN Document",
      icon: CheckCircle,
      color: "#3B82F6",
      description: "National Identification Number"
    },
    {
      name: "Voter's Card",
      icon: FileText,
      color: "#8B5CF6",
      description: "Official voter identification"
    },
  ];

  // Custom Toast Styles
  const toastStyles = `
    .custom-toast-success {
      background: linear-gradient(135deg, #111827 0%, #000000 100%) !important;
      color: #22C55E !important;
      border: 1px solid #22C55E !important;
      border-radius: 16px !important;
      backdrop-filter: blur(10px) !important;
    }
    .custom-toast-error {
      background: linear-gradient(135deg, #111827 0%, #000000 100%) !important;
      color: #EF4444 !important;
      border: 1px solid #EF4444 !important;
      border-radius: 16px !important;
      backdrop-filter: blur(10px) !important;
    }
    .custom-toast-info {
      background: linear-gradient(135deg, #111827 0%, #000000 100%) !important;
      color: #EAB308 !important;
      border: 1px solid #EAB308 !important;
      border-radius: 16px !important;
      backdrop-filter: blur(10px) !important;
    }
    .Toastify__progress-bar {
      background: #EAB308 !important;
    }
  `;

  // Fetch verification status on mount
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/verification-status");
        setIsVerified(data.verified ?? false);
        setIsPending(data.pending ?? false);
        if (data.verified || data.pending) {
          toast.info(
            data.verified
              ? "Your account is already verified."
              : "Verification is pending review.",
            { 
              position: "top-center",
              className: "custom-toast-info"
            }
          );
        }
      } catch (error) {
        console.error("Error fetching verification status:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Failed to load verification status.",
          { 
            position: "top-center",
            className: "custom-toast-error"
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationStatus();
  }, []);

  const simulateUpload = (file, setProgress, setImage, setPreview) => {
    setUploading(true);
    setProgress(0);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setUploading(false);
      }
    }, 100);
  };

  const handleImageChange = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    if (side === "front") {
      simulateUpload(file, setFrontProgress, setFrontImage, setFrontPreview);
    } else {
      simulateUpload(file, setBackProgress, setBackImage, setBackPreview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !frontImage ||
      !backImage ||
      frontProgress !== 100 ||
      backProgress !== 100
    ) {
      toast.error("Please upload both front and back images completely.", {
        position: "top-center",
        className: "custom-toast-error"
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("document_type", selectedOption);
      formData.append("front_image", frontImage);
      formData.append("back_image", backImage);

      await axiosInstance.post("/verify-document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`${selectedOption} submitted successfully for review.`, {
        position: "top-center",
        className: "custom-toast-success"
      });

      // Reset form
      setFrontImage(null);
      setBackImage(null);
      setFrontPreview(null);
      setBackPreview(null);
      setFrontProgress(0);
      setBackProgress(0);
      setShowOptions(false);
      setSelectedOption(null);
      if (frontInputRef.current) frontInputRef.current.value = "";
      if (backInputRef.current) backInputRef.current.value = "";
      setIsPending(true);
    } catch (error) {
      console.error("Error submitting document:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(
        error.response?.data?.message || "Failed to submit document for verification.",
        { 
          position: "top-center",
          className: "custom-toast-error"
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setShowOptions(false);
    setSelectedOption(null);
    setFrontImage(null);
    setBackImage(null);
    setFrontPreview(null);
    setBackPreview(null);
    setFrontProgress(0);
    setBackProgress(0);
    if (frontInputRef.current) frontInputRef.current.value = "";
    if (backInputRef.current) backInputRef.current.value = "";
  };

  const UploadArea = ({ title, progress, preview, inputRef, side, disabled }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm"
    >
      <h3 className="text-white font-semibold mb-4 flex items-center">
        <Camera className="mr-2 text-yellow-500" size={20} />
        {title}
      </h3>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
           onClick={() => !disabled && inputRef.current?.click()}>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          required
          onChange={(e) => handleImageChange(e, side)}
          className="hidden"
          disabled={disabled}
        />
        
        {!preview ? (
          <div className="space-y-3">
            <Upload className="mx-auto text-gray-400" size={40} />
            <p className="text-gray-400 text-sm">
              Click to upload {side === "front" ? "front" : "back"} image
            </p>
            <p className="text-gray-500 text-xs">
              PNG, JPG, JPEG up to 5MB
            </p>
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt={`${side} Preview`}
              className="mx-auto h-40 object-cover rounded-xl border-2 border-yellow-500/50"
            />
            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
              <CheckCircle size={16} />
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {progress > 0 && progress < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm mb-8">
      {/* Inject custom toast styles */}
      <style>{toastStyles}</style>
      <ToastContainer />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="mr-3 text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-white">Identity Verification</h2>
        </div>
        {(isVerified || isPending) && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>{isVerified ? "Verified" : "Pending"}</span>
          </div>
        )}
      </div>

      {/* Status Message */}
      <AnimatePresence>
        {(isVerified || isPending) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-black/50 backdrop-blur-sm"
          >
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={20} />
              <div>
                <h3 className="text-green-500 font-semibold">
                  {isVerified ? "Verification Complete" : "Verification Pending"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isVerified 
                    ? "Your account has been successfully verified." 
                    : "Your documents are under review. This may take 24-48 hours."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-gray-400 text-center mb-6">
        Ensure your document is valid, clearly visible, and matches your account information.
      </p>

      {/* Disabled if verified or pending */}
      {isVerified || isPending ? (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <p className="text-gray-400">
            {isVerified
              ? "Your account is fully verified and secure."
              : "Your verification request is being processed."}
          </p>
        </div>
      ) : (
        <>
          {/* Step 1: Show "Verify Me" Button */}
          {!showOptions && !selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.button
                onClick={() => setShowOptions(true)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                <Shield className="mr-2 inline" size={20} />
                Start Verification
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Show Options */}
          <AnimatePresence>
            {showOptions && !selectedOption && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-400 text-center mb-6">
                  Select your preferred verification method
                </p>
                {documentOptions.map((option) => (
                  <motion.button
                    key={option.name}
                    onClick={() => setSelectedOption(option.name)}
                    className="w-full flex items-center p-4 rounded-2xl border border-gray-700 bg-gradient-to-r from-gray-900/50 to-black/50 hover:border-yellow-500/50 transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    <div 
                      className="p-3 rounded-xl mr-4"
                      style={{ backgroundColor: `${option.color}20` }}
                    >
                      <option.icon size={20} style={{ color: option.color }} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold">{option.name}</h3>
                      <p className="text-gray-400 text-sm">{option.description}</p>
                    </div>
                  </motion.button>
                ))}
                <button
                  type="button"
                  onClick={resetAll}
                  className="w-full flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-300 mt-4"
                  disabled={loading}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Go Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Upload Files */}
          <AnimatePresence>
            {selectedOption && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 mt-6"
              >
                {/* Header with back button */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={resetAll}
                      className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 mr-4"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h3 className="text-lg font-semibold text-white">
                      Upload {selectedOption}
                    </h3>
                  </div>
                  <div className="text-yellow-500 text-sm">
                    Required
                  </div>
                </div>

                {/* Upload Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UploadArea
                    title="Front Side"
                    progress={frontProgress}
                    preview={frontPreview}
                    inputRef={frontInputRef}
                    side="front"
                    disabled={loading}
                  />
                  <UploadArea
                    title="Back Side"
                    progress={backProgress}
                    preview={backPreview}
                    inputRef={backInputRef}
                    side="back"
                    disabled={loading}
                  />
                </div>

                {/* Security Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-black/50 backdrop-blur-sm"
                >
                  <div className="flex items-start">
                    <AlertCircle className="text-yellow-500 mr-3 mt-0.5" size={16} />
                    <div>
                      <h4 className="text-yellow-500 text-sm font-semibold mb-1">
                        Security Notice
                      </h4>
                      <p className="text-gray-400 text-xs">
                        Your documents are encrypted and securely stored. We never share your personal information with third parties.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-lg disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed"
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  disabled={loading || uploading || frontProgress !== 100 || backProgress !== 100}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      Submitting for Review...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2" size={20} />
                      Submit for Verification
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default VerifyPage;