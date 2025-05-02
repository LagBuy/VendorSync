import { useState } from "react";
import LoginForm from "../components/Auth/LoginForm";
import ForgotPasswordForm from "../components/Auth/ForgotPasswordForm";
import SignupForm from "../components/Auth/SignupForm";

const AuthPage = ({ onLogin }) => {
  const [currentForm, setCurrentForm] = useState("login");

  const handleFormSwitch = (form) => {
    setCurrentForm(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        {currentForm === "login" && (
          <LoginForm onSwitch={handleFormSwitch} onLogin={onLogin} />
        )}
        {currentForm === "signup" && <SignupForm onSwitch={handleFormSwitch} />}
        {currentForm === "forgot" && (
          <ForgotPasswordForm onSwitch={handleFormSwitch} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
