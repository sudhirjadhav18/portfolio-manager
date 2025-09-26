import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./modules/auth/AuthProvider";
import ProtectedRoute from "./modules/auth/ProtectedRoute";
import AdminRoute from "./modules/auth/AdminRoute";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Layout from "./components/layout/Layout";
import Profile from "./pages/Profile.tsx";
import AccountSettings from "./pages/AccountSettings.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import Portfolios from "./pages/Portfolios.tsx";
import Charts from "./pages/Charts.tsx";
import Screener from "./pages/Screener.tsx";
import Summary from "./pages/Summary.tsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="account-settings" element={<AccountSettings />} />
            <Route
              path="admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route path="portfolios" element={<Portfolios />} />
            <Route path="charts" element={<Charts />} />
            <Route path="screener" element={<Screener />} />
            <Route path="summary" element={<Summary />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
