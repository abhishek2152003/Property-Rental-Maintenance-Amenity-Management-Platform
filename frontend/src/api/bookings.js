import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7001/api/bookings",
});

// Create a new booking
export const createBooking = async (bookingData) => {
  const response = await API.post("/", bookingData);
  return response.data;
};

// Get bookings for the current logged-in user
export const getUserBookings = async (userId) => {
  const response = await API.get(`/user/${userId}`);
  return response.data;
};

// Fetch all bookings (Admin/Owner view)
export const fetchAllBookings = async () => {
  const response = await API.get("/");
  return response.data;
};

// Fetch bookings for a specific property
export const fetchPropertyBookings = async (propertyId) => {
  const response = await API.get(`/property/${propertyId}`);
  return response.data;
};

// Fetch bookings for a specific tenant
export const fetchUserBookings = async (userId) => {
  const response = await API.get(`/user/${userId}`);
  return response.data;
};

// Cancel/Delete a booking
export const cancelBooking = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};

// Change this line in api/bookings.js
export const deleteBooking = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};

// Fetch a single booking by ID
export const getBookingById = async (id) => {
  const response = await API.get(`/${id}`);
  return response.data;
};

// Update an existing booking
export const updateBooking = async (id, bookingData) => {
  const response = await API.put(`/${id}`, bookingData);
  return response.data;
};

// Fetch all amenities (to fill the dropdown)
// export const fetchAmenities = async () => {
//   const response = await API.get("/amenity");
//   return response.data;
// };