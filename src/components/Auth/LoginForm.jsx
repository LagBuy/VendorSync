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
    <div className="w-full max-w-md mx-auto p-8 rounded-lg shadow-lg" 
         style={{ 
           backgroundColor: 'rgba(255, 255, 255, 1)',
           border: '2px solid rgba(252, 230, 0, 1)'
         }}>
      <h2 className="text-2xl font-bold mb-6 text-center" 
          style={{ color: 'rgba(17, 36, 29, 1)' }}>
        Welcome Back ✨
      </h2>
      {error && (
        <div className="text-red-500 text-sm mb-4 text-center p-3 rounded-md" 
             style={{ 
               backgroundColor: 'rgba(255, 249, 183, 0.3)',
               border: '1px solid rgba(252, 230, 0, 1)'
             }}>
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium" 
                 style={{ color: 'rgba(17, 36, 29, 1)' }}>
            Email
          </label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
            style={{ 
              borderColor: 'rgba(165, 244, 213, 1)',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: 'rgba(17, 36, 29, 1)'
            }}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium" 
                 style={{ color: 'rgba(17, 36, 29, 1)' }}>
            Password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 pr-10"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your password"
            />
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-3 cursor-pointer"
              style={{ color: 'rgba(26, 54, 43, 1)' }}
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
            className="h-4 w-4 rounded focus:ring-2 transition-colors duration-200"
            style={{ 
              borderColor: 'rgba(165, 244, 213, 1)',
              backgroundColor: rememberMe ? 'rgba(26, 54, 43, 1)' : 'rgba(255, 255, 255, 1)',
              focusRingColor: 'rgba(252, 230, 0, 1)'
            }}
          />
          <label className="text-sm" style={{ color: 'rgba(17, 36, 29, 0.8)' }}>
            Remember Me
          </label>
        </div>
        <button
          type="submit"
          className="w-full font-bold py-3 px-4 rounded-md transition duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: 'rgba(26, 54, 43, 1)',
            color: 'rgba(255, 255, 255, 1)'
          }}
        >
          Log In
        </button>
      </form>
      <div className="text-sm mt-6 text-center" style={{ color: 'rgba(17, 36, 29, 0.8)' }}>
        <p className="mb-3">
          Forgot your password?{" "}
          <button
            onClick={() => onSwitch("forgot")}
            className="font-semibold hover:underline transition-colors duration-200"
            style={{ color: 'rgba(26, 54, 43, 1)' }}
          >
            Reset here
          </button>
        </p>
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => onSwitch("signup")}
            className="font-semibold hover:underline transition-colors duration-200"
            style={{ color: 'rgba(26, 54, 43, 1)' }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;