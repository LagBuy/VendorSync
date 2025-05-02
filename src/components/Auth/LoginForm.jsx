import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = ({ onSwitch, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Load saved credentials from localStorage if available
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true); // Automatically check "Remember Me" if credentials are stored
    }
  }, []);

  // Password strength checker function
  const checkPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const numberCriteria = /\d/.test(password);
    const uppercaseCriteria = /[A-Z]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 0;
    if (lengthCriteria) strength += 1;
    if (numberCriteria) strength += 1;
    if (uppercaseCriteria) strength += 1;
    if (specialCharCriteria) strength += 1;

    setPasswordStrength(strength);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      const loggedInUser = {
        email,
        name: "Demo User",
      };

      // Save credentials to localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
      } else {
        // Remove saved credentials if "Remember Me" is unchecked
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }

      onLogin(loggedInUser); // This sets the user and redirects in App.jsx
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back 💃🏻</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {/* Password Strength Bar */}
          <div className="mt-2">
            <div
              className={`h-2 rounded-full ${
                passwordStrength === 0
                  ? "bg-gray-300"
                  : passwordStrength === 1
                  ? "bg-red-500"
                  : passwordStrength === 2
                  ? "bg-yellow-500"
                  : passwordStrength === 3
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
            ></div>
            <div className="text-sm mt-1 text-gray-600">
              {passwordStrength === 0
                ? "Weak"
                : passwordStrength === 1
                ? "Weak"
                : passwordStrength === 2
                ? "Medium"
                : passwordStrength === 3
                ? "Strong"
                : "Very Strong"}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <label className="text-sm">Remember Me</label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-4"
        >
          Login
        </button>
      </form>
      <div className="text-sm mt-4 text-center">
        <p>
          Forgot your password?{" "}
          <button
            onClick={() => onSwitch("forgot")}
            className="text-blue-600 underline"
          >
            Reset here
          </button>
        </p>
        <p className="mt-2">
          Don't have an account?{" "}
          <button
            onClick={() => onSwitch("signup")}
            className="text-blue-600 underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
