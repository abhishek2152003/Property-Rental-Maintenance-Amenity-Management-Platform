import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PropertyForm from "./pages/PropertyForm";
import AmenityForm from "./pages/AmenityForm"
import PropertyView from "./pages/PropertiesView";
import AmenityView from "./pages/AmenitiesView"
import MaintenanceRequestForm from "./pages/MaintenanceRequestForm";
import BookingForm from "./pages/BookingForm"
import MaintenanceRequestView from "./pages/MaintenanceRequestView";
import BookingView from "./pages/BookingView"
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import AddTenant from "./pages/AddTenant";
import ProfileEdit from "./pages/ProfileEdit";
import TenantsView from "./pages/TenantsView";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./component/ProtectedRoute";
import GuestRoute from "./component/GuestRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmProvider } from "./context/ConfirmContext";

export default function App() {
  return (
    <ConfirmProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {/* Public / Guest Routes */}
        <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

        {/* Unified Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardSwitcher />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route path="/profile" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />

        {/* Owner-only Routes (Flat for compatibility with 'user' prop) */}
        <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/properties" element={<ProtectedRoute allowedRoles={["owner"]}><PropertyView /></ProtectedRoute>} />
        <Route path="/owner/properties/add" element={<ProtectedRoute allowedRoles={["owner"]}><PropertyForm /></ProtectedRoute>} />
        <Route path="/owner/properties/edit/:id" element={<ProtectedRoute allowedRoles={["owner"]}><PropertyForm /></ProtectedRoute>} />
        <Route path="/owner/amenities" element={<ProtectedRoute allowedRoles={["owner"]}><AmenityView /></ProtectedRoute>} />
        <Route path="/owner/amenities/add" element={<ProtectedRoute allowedRoles={["owner"]}><AmenityForm /></ProtectedRoute>} />
        <Route path="/owner/amenities/edit/:id" element={<ProtectedRoute allowedRoles={["owner"]}><AmenityForm /></ProtectedRoute>} />
        <Route path="/owner/tenants" element={<ProtectedRoute allowedRoles={["owner"]}><TenantsView /></ProtectedRoute>} />
        <Route path="/owner/tenants/add" element={<ProtectedRoute allowedRoles={["owner"]}><AddTenant /></ProtectedRoute>} />
        <Route path="/owner/maintenance" element={<ProtectedRoute allowedRoles={["owner"]}><MaintenanceRequestView /></ProtectedRoute>} />
        <Route path="/owner/bookings" element={<ProtectedRoute allowedRoles={["owner"]}><BookingView /></ProtectedRoute>} />

        {/* Tenant-only Routes */}
        <Route path="/tenant/dashboard" element={<ProtectedRoute allowedRoles={["tenant"]}><TenantDashboard /></ProtectedRoute>} />
        <Route path="/tenant/maintenance" element={<ProtectedRoute allowedRoles={["tenant"]}><MaintenanceRequestView /></ProtectedRoute>} />
        <Route path="/tenant/maintenance/add" element={<ProtectedRoute allowedRoles={["tenant"]}><MaintenanceRequestForm /></ProtectedRoute>} />
        <Route path="/tenant/maintenance/edit/:id" element={<ProtectedRoute allowedRoles={["tenant"]}><MaintenanceRequestForm /></ProtectedRoute>} />
        <Route path="/tenant/bookings" element={<ProtectedRoute allowedRoles={["tenant"]}><BookingView /></ProtectedRoute>} />
        <Route path="/tenant/bookings/add" element={<ProtectedRoute allowedRoles={["tenant"]}><BookingForm /></ProtectedRoute>} />
        <Route path="/tenant/bookings/edit/:id" element={<ProtectedRoute allowedRoles={["tenant"]}><BookingForm /></ProtectedRoute>} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConfirmProvider>
  );
}

/**
 * Helper component to switch between dashboards based on user role.
 * Receives 'user' prop from ProtectedRoute via React.cloneElement.
 */
function DashboardSwitcher({ user }) {
  if (user?.role?.toLowerCase() === "owner") {
    return <OwnerDashboard user={user} />;
  }
  return <TenantDashboard user={user} />;
}
