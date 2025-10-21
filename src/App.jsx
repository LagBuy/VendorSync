import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
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

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateUser = () => {
      const jwt = Cookies.get("jwt-token");
      console.log("Checking JWT token:", !!jwt);

      if (jwt) {
        // Assume user is authenticated if token exists
        setUser({ isAuthenticated: true });
      } else {
        setUser(null);
        if (window.location.pathname !== "/reset-password") {
          console.log("No JWT, redirecting to /auth");
          navigate("/auth", { replace: true });
        }
      }
    };

    validateUser();
  }, [navigate]);

  const handleLogin = (loggedInUser, jwt) => {
    console.log("Logging in user:", loggedInUser);
    setUser(loggedInUser);
    Cookies.set("jwt-token", jwt, { expires: 1 }); // 1-day expiry
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-200 text-gray-100 overflow-hidden">
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
              <Route
                path="/auth"
                element={<AuthPage onLogin={handleLogin} />}
              />
              <Route path="/reset-password" element={<ChangePasswordForm />} />
              <Route path="*" element={<AuthPage onLogin={handleLogin} />} />
            </>
          )}
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        closeButton={true}
      />
    </div>
  );
}

export default App;
