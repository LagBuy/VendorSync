import { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { axiosInstance } from "../../axios-instance/axios-instance";

const LoginForm = ({ onSwitch, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = Cookies.get("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please input your email and password");
      setIsLoading(false);
      return;
    }

    const reqBody = {
      email,
      password,
    };

    try {
      const { data } = await axiosInstance.post("/auth/login/", reqBody);
      const { user, access } = data;

      console.log(access);

      Cookies.set("jwt-token", access, { expires: 7 });

      if (rememberMe) {
        Cookies.set("savedEmail", email, { expires: 7 });
      } else {
        Cookies.remove("savedEmail");
      }

      onLogin(user, access);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        border: "2px solid rgba(252, 230, 0, 1)",
        backgroundImage:
          "linear-gradient(135deg, rgba(252, 230, 0, 0.05) 0%, rgba(165, 244, 213, 0.05) 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <div
        className="absolute top-0 right-0 w-32 h-32 -translate-y-16 translate-x-16 rounded-full opacity-10"
        style={{ backgroundColor: "rgba(252, 230, 0, 1)" }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-24 h-24 -translate-x-12 translate-y-12 rounded-full opacity-10"
        style={{ backgroundColor: "rgba(165, 244, 213, 1)" }}
      ></div>

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div
          className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: "rgba(252, 230, 0, 0.15)",
            border: "2px solid rgba(252, 230, 0, 0.5)",
          }}
        >
          <span className="text-3xl">✨</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-900 to-black bg-clip-text text-transparent mb-2">
          Welcome Back
        </h2>
        <p className="text-sm" style={{ color: "rgba(17, 36, 29, 0.7)" }}>
          Sign in to your account to continue
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-4 rounded-xl text-center text-sm font-medium relative z-10"
          style={{
            backgroundColor: "rgba(255, 249, 183, 0.3)",
            border: "1px solid rgba(252, 230, 0, 0.5)",
            color: "rgba(17, 36, 29, 1)",
          }}
        >
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-6 relative z-10">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold pl-1"
            style={{ color: "rgba(17, 36, 29, 1)" }}
          >
            Email Address
          </label>
          <div className="relative">
            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: "rgba(26, 54, 43, 0.6)" }}
            >
              <FaUser size={16} />
            </div>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 placeholder-opacity-60"
              style={{
                borderColor: "rgba(165, 244, 213, 1)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                color: "rgba(17, 36, 29, 1)",
                focusRingColor: "rgba(252, 230, 0, 0.3)",
              }}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold pl-1"
            style={{ color: "rgba(17, 36, 29, 1)" }}
          >
            Password
          </label>
          <div className="relative">
            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: "rgba(26, 54, 43, 0.6)" }}
            >
              <FaLock size={16} />
            </div>
            <input
              type={passwordVisible ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 placeholder-opacity-60"
              style={{
                borderColor: "rgba(165, 244, 213, 1)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                color: "rgba(17, 36, 29, 1)",
                focusRingColor: "rgba(252, 230, 0, 0.3)",
              }}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 hover:scale-110"
              style={{ color: "rgba(26, 54, 43, 0.7)" }}
              disabled={isLoading}
            >
              {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div
              className={`relative w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                rememberMe ? "scale-110" : ""
              }`}
              style={{
                borderColor: rememberMe
                  ? "rgba(26, 54, 43, 1)"
                  : "rgba(165, 244, 213, 1)",
                backgroundColor: rememberMe
                  ? "rgba(26, 54, 43, 1)"
                  : "rgba(255, 255, 255, 0.8)",
              }}
            >
              {rememberMe && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <span
              className="text-sm font-medium group-hover:opacity-80 transition-opacity duration-200"
              style={{ color: "rgba(17, 36, 29, 0.9)" }}
            >
              Remember Me
            </span>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="absolute opacity-0 cursor-pointer"
              disabled={isLoading}
            />
          </label>

          <button
            type="button"
            onClick={() => onSwitch("forgot")}
            className="text-sm font-semibold hover:underline transition-all duration-200 hover:scale-105"
            style={{ color: "rgba(26, 54, 43, 1)" }}
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 group"
          style={{
            backgroundColor: "rgba(26, 54, 43, 1)",
            backgroundImage:
              "linear-gradient(135deg, rgba(26, 54, 43, 1) 0%, rgba(17, 36, 29, 1) 100%)",
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div
        className="text-center mt-8 pt-6 border-t relative z-10"
        style={{ borderColor: "rgba(165, 244, 213, 0.5)" }}
      >
        <p className="text-sm mb-3" style={{ color: "rgba(17, 36, 29, 0.7)" }}>
          Don't have an account?{" "}
          <button
            onClick={() => onSwitch("signup")}
            className="font-bold hover:underline transition-all duration-200 hover:scale-105"
            style={{ color: "rgba(26, 54, 43, 1)" }}
            disabled={isLoading}
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
