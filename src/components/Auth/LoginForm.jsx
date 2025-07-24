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
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#1A362B] p-8 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#F7E4A8]">
        Welcome Back ✨
      </h2>
      {error && (
        <div className="text-[#F7E4A8] bg-red-500/20 border border-red-500 text-sm mb-4 text-center p-2 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-white">
            Email
          </label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7E4A8] placeholder-white/50"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-white">
            Password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2d062] placeholder-white/50"
              placeholder="Enter your password"
            />
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-3 cursor-pointer text-white/70 hover:text-[#fde080]"
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
            className="h-4 w-4 text-[#fada71] focus:ring-[#ffdc6b] border-white/20 rounded bg-white/10"
          />
          <label className="text-sm text-white/80">Remember Me</label>
        </div>
        <button
          type="submit"
          className="w-full bg-[#fdd140] hover:bg-[#F7E4A8]/80 text-[#1A362B] font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
        >
          Log In
        </button>
      </form>
      <div className="text-sm mt-4 text-center text-white/80">
        <p>
          Forgot your password?{" "}
          <button
            onClick={() => onSwitch("forgot")}
            className="text-[#F7E4A8] hover:underline"
          >
            Reset here
          </button>
        </p>
        <p className="mt-2">
          Don't have an account?{" "}
          <button
            onClick={() => onSwitch("signup")}
            className="text-[#F7E4A8] hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
