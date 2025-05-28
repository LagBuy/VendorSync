import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import OverViewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import Sidebar from "./components/common/Sidebar";
import AuthPage from "./pages/AuthPage";
import PaymentHistory from "./pages/PaymentHistory";
import ChangePasswordForm from "./components/Auth/ChangePasswordForm";
; // this is coming directly from components. I forgot to call it in my sub-parent route which is the AuthPage.jsx
import { axiosInstance } from "./axios-instance/axios-instance";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateUser = async () => {
      const jwt = Cookies.get("jwt-token");

      if (jwt) {
        try {
          // this particular lines of code are optional. You can remove it sha. But it helps to test if this code will work during testing if and only if there's /auth/me endpoint.
          const { data } = await axiosInstance.get("/auth/me");
          setUser(data.user);
        } catch (e) {
          console.log(e)
          toast.error("Session expired. Please log in again.");
          Cookies.remove("jwt-token");
          setUser(null);
          navigate("/auth", { replace: true });
        }
      } else {
        if (window.location.pathname !== "/reset-password") {
          navigate("/auth", { replace: true });
        }
      }
    };

    validateUser();
  }, [navigate]);

  const handleLogin = (loggedInUser, jwt) => {
    setUser(loggedInUser);
    Cookies.set("jwt-token", jwt, { expires: 1 }); // 1-day expiry
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {user && <Sidebar onLogin={handleLogin} />}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<OverViewPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/payment" element={<PaymentHistory />} />
              <Route path="/settings" element={<SettingsPage />} />
            </>
          ) : (
            <>
              <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
              <Route path="/reset-password" element={<ChangePasswordForm />} />
              <Route path="*" element={<AuthPage onLogin={handleLogin} />} />
            </>
          )}
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;