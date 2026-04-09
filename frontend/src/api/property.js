import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7001/api/property", // Ensure port matches your server
  withCredentials: true, // Required if you are using cookies/sessions for auth
});

export const createProperty = async (formData) => {
  // Since we are sending a File, we use FormData
  const data = new FormData();
  data.append("name", formData.name);
  data.append("address", formData.address);
  data.append("totalUnits", formData.totalUnits);
  data.append("description", formData.description);
  data.append("ownerId", formData.ownerId);

  if (formData.image) {
    data.append("image", formData.image);
  }

  // Axios automatically sets 'multipart/form-data' when it sees FormData
  const response = await API.post("/", data);
  return response.data;
};

export const getProperties = async () => {
  const response = await API.get("/");
  return response.data;
};

export const deleteProperty = async (id) => {
  try {
    const response = await API.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Also good to have for your "Edit" functionality later
export const updateProperty = async (id, updateData) => {
  const response = await API.put(`/${id}`, updateData);
  return response.data;
};

export const fetchOwnerProperties = async (ownerId) => {
  const token = localStorage.getItem("token");
  return await API.get(`/owner/${ownerId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const fetchSingleProperty = async (id) => {
  const token = localStorage.getItem("token");
  return await API.get(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addTenantToProperty = async (propertyId, email) => {
  const token = localStorage.getItem("token");
  const response = await API.post(`/${propertyId}/add-tenant`, { email }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
