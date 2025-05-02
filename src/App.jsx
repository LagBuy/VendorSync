import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("authUser"));
    setUser(savedUser);

    if (!savedUser) {
      navigate("/auth");
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("authUser", JSON.stringify(loggedInUser));
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    navigate("/auth");
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
        {/* This handles any other route by forcing back to login */}
        <Route path="*" element={<AuthPage onLogin={handleLogin} />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<OverViewPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/payment" element={<PaymentHistory />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
