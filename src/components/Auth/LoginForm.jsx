import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import { axiosInstance } from "../../axios-instance/axios-instance";

const LoginForm = ({ onSwitch, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

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

    if (!email || !password) {
      setError("Please input your email and password");
      return;
    }

    const reqBody = {
      email,
      password,
    };

    try {
      const { data } = await axiosInstance.post("/auth/login", reqBody);
      const { user, access } = data;
      Cookies.set("jwt-token", access, { expires: 7 });

      if (rememberMe) {
        Cookies.set("savedEmail", email, { expires: 7 });
      } else {
        Cookies.remove("savedEmail");
      }

      onLogin(user, access);
    } catch (e) {
      setError(
        e.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back 💃</h2>
      {error && (
        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
              placeholder="Enter your password"
            />
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-blue-rose-400 focus:ring-blue-rose-400 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-600">Remember Me</label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-rose-500 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          Log In
        </button>
      </form>
      <div className="text-sm mt-4 text-center text-gray-600">
        <p>
          Forgot your password?{" "}
          <button
            onClick={() => onSwitch("forgot")}
            className="text-blue-500 hover:underline"
          >
            Reset here
          </button>
        </p>
        <p className="mt-2">
          Don't have an account?{" "}
          <button
            onClick={() => onSwitch("signup")}
            className="text-blue-500 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;