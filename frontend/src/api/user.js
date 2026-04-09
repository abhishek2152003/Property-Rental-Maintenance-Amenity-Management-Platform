import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7001/api/users",
});

// Update Profile (Handles both Text and Image)
export const updateProfile = async (id, formData) => {
  const token = localStorage.getItem("token");
  const response = await API.put(`/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch current user details
export const fetchUserProfile = async (id) => {
  const token = localStorage.getItem("token");
  const response = await API.get(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch all tenants for an owner
export const apiGetTenantsByOwner = async (ownerId) => {
  const token = localStorage.getItem("token");
  const response = await API.get(`/tenants/owner/${ownerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Remove a tenant from a property
export const apiRemoveTenant = async (tenantId) => {
  const token = localStorage.getItem("token");
  const response = await API.put(`/tenants/${tenantId}/remove`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};