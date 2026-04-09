import { Routes, Route } from "react-router-dom";
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

import Test from "./pages/Test";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import AddTenant from "./pages/AddTenant";
import ProfileEdit from "./pages/ProfileEdit";
import TenantsView from "./pages/TenantsView";
import { jwtDecode } from "jwt-decode";


export default function App() {
  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (e) {
      console.error("Auth Error", e);
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/dashboard" 
        element={
          user?.role?.toLowerCase() === "owner" 
            ? <OwnerDashboard user={user} /> 
            : <TenantDashboard user={user} />
        } 
      />
      <Route path="/owner/dashboard" element={<OwnerDashboard user={user} />} />
      <Route path="/tenant/dashboard" element={<TenantDashboard user={user} />} />
      <Route path="/test" element={<Test />} />
      <Route path="/profile" element={<ProfileEdit />} />

      {/* owners routes */}
      <Route path="/owner/properties/add" element={<PropertyForm />} />
      <Route path="/owner/properties/edit/:id" element={<PropertyForm />} />
      <Route path="/owner/amenities/add" element={<AmenityForm />} />
      <Route path="/owner/amenities/edit/:id" element={<AmenityForm />} />
      <Route path="/owner/properties" element={<PropertyView />} />
      <Route path="/owner/amenities" element={<AmenityView />} />
      <Route path="/owner/tenants" element={<TenantsView />} />
      <Route path="/owner/tenants/add" element={<AddTenant />} />
      <Route path="/owner/maintenance" element={<MaintenanceRequestView />} />
      <Route path="/owner/bookings" element={<BookingView />} />


      {/* tenants routes */}
      <Route path="/tenant/maintenance/add" element={<MaintenanceRequestForm />} />
      <Route path="/tenant/maintenance/edit/:id" element={<MaintenanceRequestForm />} />
      <Route path="/tenant/bookings/add" element={<BookingForm />} />
      <Route path="/tenant/bookings/edit/:id" element={<BookingForm />} />
      <Route path="/tenant/maintenance" element={<MaintenanceRequestView />} />
      <Route path="/tenant/bookings" element={<BookingView />} />
      {/* 
      <Route path="/submitrequest" element={<SubmitRequest/>} /> */}
    </Routes>
  );
}
