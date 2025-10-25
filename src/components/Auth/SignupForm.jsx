import { useState, useRef } from "react";
import { FaEye, FaEyeSlash, FaCloudUploadAlt, FaMapMarkerAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { toast } from "react-toastify";
import { 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Calendar,
  ChevronRight,
  Sparkles,
  Shield,
  Truck
} from "lucide-react";

const SignupForm = ({ onSwitch, email: initialEmail = "" }) => {
  const [step, setStep] = useState(initialEmail ? 3 : 1);
  const [formData, setFormData] = useState({
    email: initialEmail,
    firstName: "",
    lastName: "",
    gender: "",
    address: "",
    dob: "1990-01-01",
    phone: "",
    businessName: "",
    business_address: "", // New field for full Lagos address
    businessImage: null,
    userCity: "",
    userState: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDuplicateEmailModal, setShowDuplicateEmailModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const SIGNUP_ENDPOINT = "/auth/signup/";

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setFormData(prev => ({ ...prev, businessImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateEmail = (email) => {
    return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateName = (name) => {
    const namePattern = /^[A-Za-z\s]+$/;
    return (
      !name ||
      !namePattern.test(name.trim()) ||
      !/[A-Za-z]/.test(name.trim()[0])
    );
  };

  const validatePhone = (phone) => {
    const phonePattern = /^0(7|8|9)\d{9}$/;
    return !phonePattern.test(phone);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return !passwordPattern.test(password);
  };

  const validateStep3 = () => {
    const { firstName, lastName, userCity, userState, dob, phone } = formData;

    if (validateName(firstName)) {
      setError(
        "First name must contain only letters and spaces, and start with a letter."
      );
      return false;
    }

    if (validateName(lastName)) {
      setError(
        "Last name must contain only letters and spaces, and start with a letter."
      );
      return false;
    }

    if (validateName(userCity)) {
      setError(
        "Your city must contain only letters and spaces, and start with a letter."
      );
      return false;
    }

    if (validateName(userState)) {
      setError(
        "Your state must contain only letters and spaces, and start with a letter."
      );
      return false;
    }

    const dobPattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dob || !dobPattern.test(dob)) {
      setError("Date of Birth must be a valid date in YYYY-MM-DD format.");
      return false;
    }

    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age;
    }
    if (age < 18) {
      setError("You must be at least 18 years old.");
      return false;
    }

    if (validatePhone(phone)) {
      setError(
        "Phone must be 11 digits, start with 07, 08, or 09 (e.g., 08012345678)."
      );
      return false;
    }

    return true;
  };

  const validateStep4 = () => {
    const {
      businessName,
      business_address,
      password,
      confirmPassword,
      businessImage,
    } = formData;

    if (validateName(businessName)) {
      setError(
        "Business name must contain only letters and spaces, and start with a letter."
      );
      return false;
    }

    if (!business_address.trim()) {
      setError("Please enter your business address in Lagos.");
      return false;
    }

    // Basic validation for Lagos address
    if (!business_address.toLowerCase().includes("lagos")) {
      setError("Business address must be in Lagos, Nigeria.");
      return false;
    }

    if (!businessImage) {
      setError("Please upload  your business logo.");
      return false;
    }

    if (validatePassword(password)) {
      setError(
        "Password must be strong (8+ chars, 1 capital, 1 number, 1 special char)."
      );
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSkipEmailVerification = (e) => {
    e.preventDefault();
    setError("");

    if (validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStep(3);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateStep4()) {
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("password1", formData.password);
      formDataToSend.append("password2", formData.confirmPassword);
      formDataToSend.append("roles", "user");
      formDataToSend.append("roles", "vendor");
      formDataToSend.append("first_name", formData.firstName.trim());
      formDataToSend.append("last_name", formData.lastName.trim());
      formDataToSend.append("phone_number", formData.phone);
      formDataToSend.append("address", formData.address.trim());
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("state", formData.userState.trim());
      formDataToSend.append("city", formData.userCity.trim());
      formDataToSend.append("business_name", formData.businessName.trim());
      formDataToSend.append("business_address", formData.business_address.trim());
      
      if (formData.businessImage) {
        formDataToSend.append("business_image", formData.businessImage);
      }

      console.log("Signup FormData:", Object.fromEntries(formDataToSend));

      const signupResponse = await axiosInstance.post(SIGNUP_ENDPOINT, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Signup Response:", signupResponse.data);

      toast.success(
        "Vendor account created successfully! Verification email has been sent."
      );

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Signup Error:", error);

      if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.email) {
          setError(
            `Email error: ${
              Array.isArray(errorData.email)
                ? errorData.email[0]
                : errorData.email
            }`
          );
        } else if (errorData.business_name) {
          setError(
            `Business name error: ${
              Array.isArray(errorData.business_name)
                ? errorData.business_name[0]
                : errorData.business_name
            }`
          );
        } else if (errorData.phone_number) {
          setError(
            `Phone number error: ${
              Array.isArray(errorData.phone_number)
                ? errorData.phone_number[0]
                : errorData.phone_number
            }`
          );
        } else if (errorData.password1) {
          setError(
            `Password error: ${
              Array.isArray(errorData.password1)
                ? errorData.password1[0]
                : errorData.password1
            }`
          );
        } else if (errorData.non_field_errors) {
          setError(
            `Error: ${
              Array.isArray(errorData.non_field_errors)
                ? errorData.non_field_errors[0]
                : errorData.non_field_errors
            }`
          );
        } else if (
          errorData.message?.includes("email already exists") ||
          errorData.detail?.includes("email already exists") ||
          errorData.email?.includes("already exists") ||
          errorData.email?.some?.((msg) => msg.includes("already exists"))
        ) {
          setShowDuplicateEmailModal(true);
        } else {
          setError(
            errorData.message ||
              "Hmmm... we can't seem to register your business on LAGBUY. If this persists, please contact support."
          );
        }
      } else {
        setError("Signup failed. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (step > 3) setStep(step - 1);
    else if (step === 3) setStep(1);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onSwitch("login");
  };

  const handleCloseDuplicateEmailModal = () => {
    setShowDuplicateEmailModal(false);
    setFormData((prev) => ({ ...prev, email: "" }));
    setStep(1);
  };

  // Progress steps
  const steps = [
    { number: 1, title: "Email", icon: Mail },
    { number: 2, title: "Personal Info", icon: User },
    { number: 3, title: "Business Details", icon: Store },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-200"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/30"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm">JOIN LAGBUY VENDORS</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Start Selling on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-100 to-yellow-100">
                LagBuy
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-green-100 text-lg max-w-2xl mx-auto"
            >
              Join almost 500+ vendors on LAGBUY
            </motion.p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-8 pt-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  step >= stepItem.number 
                    ? 'bg-gradient-to-r from-green-500 to-yellow-500 border-transparent text-white' 
                    : 'border-green-300 text-green-300'
                } transition-all duration-300`}>
                  <stepItem.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepItem.number ? 'bg-gradient-to-r from-green-500 to-yellow-500' : 'bg-green-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="px-8 pb-8">
          <div className="max-w-2xl mx-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3"
              >
                <Shield className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            {/* Step 1: Email */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Mail className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Let's Get Started</h3>
                  <p className="text-gray-600">Enter your email to begin your vendor journey</p>
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-green-50 border-2 border-green-200 rounded-2xl focus:outline-none focus:border-green-500 text-gray-900 placeholder-green-600 transition-all duration-300 text-lg"
                    placeholder="your@business.com"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSkipEmailVerification}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-green-500/25 border-2 border-white/20 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-3 text-lg">
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Continue 
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </motion.button>

                <div className="text-center">
                  <button
                    onClick={() => onSwitch("login")}
                    className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
                  >
                    Already have an account? Log in
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Personal Information */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <User className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h3>
                  <p className="text-gray-600">We need to know a bit about the person behind the business</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => handleInputChange("dob", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                        placeholder="08012345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your State</label>
                    <input
                      type="text"
                      required
                      value={formData.userState}
                      onChange={(e) => handleInputChange("userState", e.target.value)}
                      className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                      placeholder="Lagos"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your City</label>
                    <input
                      type="text"
                      required
                      value={formData.userCity}
                      onChange={(e) => handleInputChange("userCity", e.target.value)}
                      className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                      placeholder="Ikeja"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-green-500 w-4 h-4" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                        placeholder="Your complete residential address"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 transition-all duration-300 hover:border-gray-300"
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setError("");
                      if (validateStep3()) setStep(4);
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-500/25 border-2 border-white/20 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center gap-2">
                      Continue 
                      <Store className="w-4 h-4" />
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Business Details */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Store className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h3>
                  <p className="text-gray-600">Tell us about your amazing business</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                        placeholder="Your awesome business name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Address in Lagos
                      <span className="text-green-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-4 text-green-500 w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={formData.business_address}
                        onChange={(e) => handleInputChange("business_address", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                        placeholder="e.g., 123 Business Street, Ikeja, Lagos"
                      />
                    </div>
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Must be a valid Lagos, Nigeria address
                    </p>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Logo
                      <span className="text-green-500 ml-1">*</span>
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-green-300 rounded-2xl p-8 text-center cursor-pointer bg-green-50 hover:bg-green-100 transition-all duration-300"
                    >
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img 
                            src={imagePreview} 
                            alt="Business preview" 
                            className="w-32 h-32 object-cover rounded-xl mx-auto border-2 border-green-200"
                          />
                          <p className="text-green-600 font-semibold">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <FaCloudUploadAlt className="w-12 h-12 text-green-400 mx-auto" />
                          <div>
                            <p className="text-gray-700 font-semibold">Upload Business Logo</p>
                            <p className="text-gray-500 text-sm">PNG, JPG up to 5MB</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        <input
                          type={passwordVisible ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className="w-full pl-12 pr-12 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                          placeholder="Create secure password"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600"
                        >
                          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        <input
                          type={confirmPasswordVisible ? "text" : "password"}
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className="w-full pl-12 pr-12 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 transition-all duration-300"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600"
                        >
                          {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 transition-all duration-300 hover:border-gray-300"
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignup}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-500/25 border-2 border-white/20 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Truck className="w-5 h-5" />
                          Submit
                        </>
                      )}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-4 text-center">
          <p className="text-white/80 text-sm">
            🚀 Join vendors making ₦50K - ₦250K monthly on LagBuy
          </p>
        </div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border-4 border-green-200 shadow-2xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Welcome to LagBuy! 🎉</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your vendor account has been created successfully! A verification email has been sent to{" "}
                  <strong className="text-green-600">{formData.email}</strong>. 
                  Check your inbox (and spam folder) to verify your account and start selling!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseSuccessModal}
                  className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg"
                >
                  Start Selling Now!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duplicate Email Modal */}
      <AnimatePresence>
        {showDuplicateEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border-4 border-yellow-200 shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4">Email Already Registered</h3>
                <p className="text-gray-600 mb-6">
                  This email is already associated with an account. Would you like to log in instead?
                </p>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseDuplicateEmailModal}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl border-2 border-gray-200"
                  >
                    Try Another Email
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowDuplicateEmailModal(false);
                      onSwitch("login");
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-yellow-500 text-white font-bold py-3 rounded-xl shadow-lg"
                  >
                    Log In
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignupForm;