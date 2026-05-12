import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001'}/api`, 
});

// 1. Submit the request
export const createMaintenanceRequest = async (formData) => {
  const response = await API.post("/maintenance", formData);
  return response.data;
};

// 2. Get properties for the dropdown
export const fetchProperties = async () => {
  const response = await API.get("/property");
  return response.data;
};

// 3. Optional: Get requests for a specific user
export const fetchUserRequests = async (userId) => {
  const response = await API.get(`/maintenance/user/${userId}`);
  return response.data;
};

// 4. Delete Maintenance Request
export const deleteMaintenanceRequest = async (id) => {
  try {
    const response = await API.delete(`/maintenance/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// 5. Get all maintenance requests (Owner)
export const getAllRequests = async () => {
  const token = localStorage.getItem("token");
  const response = await API.get("/maintenance", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 6. Update Maintenance Status
export const updateMaintenanceStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  const response = await API.patch(`/maintenance/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 7. Get Maintenance Request by ID
export const getMaintenanceRequestById = async (id) => {
  const response = await API.get(`/maintenance/${id}`);
  return response.data;
};

// 8. Update Maintenance Request
export const updateMaintenanceRequest = async (id, formData) => {
  const response = await API.put(`/maintenance/${id}`, formData);
  return response.data;
};