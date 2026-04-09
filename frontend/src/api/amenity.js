import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7001/api", 
});

// 1. Create Amenity (Handles Image + Data)
export const createAmenity = async (formData) => {
  const data = new FormData();
  data.append("name", formData.name);
  data.append("propertyId", formData.propertyId);
  data.append("description", formData.description);
  
  // Only append if the user actually selected a file
  if (formData.image) {
    data.append("image", formData.image); 
  }

  const response = await API.post("/amenity", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 2. Fetch all properties (To fill the dropdown in the form)
export const fetchProperties = async () => {
  const response = await API.get("/property");
  return response.data;
};

// 3. Get Amenities for a specific property
export const getPropertyAmenities = async (propertyId) => {
  const response = await API.get(`/amenity/${propertyId}/amenities`);
  return response.data;
};

// 4. Delete Amenity
export const deleteAmenity = async (id) => {
  try {
    const response = await API.delete(`/amenity/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// 5. Get Single Amenity
export const getAmenityById = async (id) => {
  const response = await API.get(`/amenity/${id}`);
  return response.data;
};

// 6. Update Amenity
export const updateAmenity = async (id, updateData) => {
  const response = await API.put(`/amenity/${id}`, updateData);
  return response.data;
};