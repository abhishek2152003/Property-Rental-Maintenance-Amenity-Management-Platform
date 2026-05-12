import axios from "axios";
const API_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001'}/api/dashboard`;

export const apiGetOwnerDashboardData = async (ownerId, params = {}) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/owner/${ownerId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
};

export const apiGetTenantDashboardData = async (tenantId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/tenant/${tenantId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
