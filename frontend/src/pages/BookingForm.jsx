import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createBooking, getBookingById, updateBooking } from "../api/bookings";
import { Box, Typography, Button } from "@mui/material";
import DashboardLayout from "../component/SideBar";
import { jwtDecode } from "jwt-decode";
import { fetchUserProfile } from "../api/user";
import { getPropertyAmenities } from "../api/amenity";

// PropFlow Design Tokens
const tokens = {
  navy950: "#0A1628",
  navy900: "#0F2044",
  navy800: "#162B5B",
  navy700: "#1E3A72",
  blue500: "#3B82F6",
  blue50: "#EFF6FF",
  slate900: "#0F172A",
  slate700: "#334155",
  slate500: "#64748B",
  slate300: "#CBD5E1",
  slate100: "#F1F5F9",
  white: "#FFFFFF",
  error: "#EF4444",
};

// Reusable styling for form inputs
const inputStyles = {
  padding: "10px 14px",
  borderRadius: "12px", // --radius-md
  border: `1.5px solid ${tokens.slate300}`,
  fontFamily: '"DM Sans", sans-serif',
  fontSize: "14px",
  color: tokens.slate900,
  backgroundColor: tokens.white,
  transition: "border-color 0.2s, box-shadow 0.2s",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  "&:focus": {
    borderColor: tokens.blue500,
    boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
  },
  "&::placeholder": {
    color: tokens.slate500,
  },
  // Ensure date/time pickers look consistent
  "&::-webkit-calendar-picker-indicator": {
    cursor: "pointer",
    opacity: 0.6,
    transition: "0.2s",
    "&:hover": { opacity: 1 },
  },
};

const labelStyles = {
  fontSize: "12px",
  fontWeight: 600,
  color: tokens.slate700,
  letterSpacing: "0.03em",
  fontFamily: '"DM Sans", sans-serif',
};

export default function CreateBookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [formData, setFormData] = useState({
    amenityId: "",
    userId: "",
    propertyId: "",
    bookingDate: "",
    checkInTime: "",
    checkOutTime: "",
    status: "confirmed",
  });

  // Load user profile and their property amenities
  useEffect(() => {
    const initData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          const userProfile = await fetchUserProfile(decoded.id);
          
          let currentPropertyId = userProfile.propertyId || "";

          if (id) {
            setIsEditMode(true);
            const bookingData = await getBookingById(id);
            if (bookingData) {
              setFormData({
                amenityId: bookingData.amenityId || "",
                userId: decoded.id,
                propertyId: bookingData.propertyId || currentPropertyId,
                bookingDate: bookingData.bookingDate ? bookingData.bookingDate.split("T")[0] : "",
                checkInTime: bookingData.checkInTime || "",
                checkOutTime: bookingData.checkOutTime || "",
                status: bookingData.status || "confirmed",
              });
              currentPropertyId = bookingData.propertyId || currentPropertyId;
            }
          } else {
            setFormData((prev) => ({
              ...prev,
              userId: decoded.id,
              propertyId: currentPropertyId,
            }));
          }

          if (currentPropertyId) {
            const propertyAmenities = await getPropertyAmenities(currentPropertyId);
            setAmenities(propertyAmenities);
          }
        }
      } catch (err) {
        console.error("Failed to load user, booking or amenities", err);
      }
    };
    initData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateBooking(id, formData);
        alert("Booking updated successfully!");
        navigate(-1); // Go back
      } else {
        await createBooking(formData);
        alert("Booking confirmed successfully!");
        setFormData({ ...formData, bookingDate: "", checkInTime: "", checkOutTime: "" }); // Reset some fields
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };
  return (
    <DashboardLayout pageTitle="Bookings">
      <Box
        sx={{
          padding: { xs: "20px", md: "32px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "800px" }}>
          {/* Section Title */}
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Libre Baskerville", serif',
              fontSize: "24px",
              fontWeight: 700,
              color: tokens.navy900,
              mb: 3,
            }}
          >
            {isEditMode ? "Modify Your Booking" : "Book an Amenity"}
          </Typography>

          {/* Form Card Container */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: tokens.white,
              borderRadius: "24px", // --radius-xl
              padding: { xs: "20px", md: "28px" },
              boxShadow: "0 4px 16px rgba(15,32,68,0.10)", // --shadow-md
            }}
          >
            {/* CSS Grid for Layout */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: "16px",
              }}
            >
              {/* Amenity Dropdown (Maps to amenityId) */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  gridColumn: "1 / -1",
                }}
              >
                <Typography component="label" sx={labelStyles}>
                  Select Amenity *
                </Typography>
                <Box
                  component="select"
                  name="amenityId"
                  required
                  value={formData.amenityId}
                  onChange={handleChange}
                  sx={{ ...inputStyles, cursor: "pointer", appearance: "auto" }}
                >
                  <option value="" disabled>
                    Choose an amenity...
                  </option>
                  {amenities.map((amenity) => (
                    <option key={amenity._id} value={amenity._id}>
                      {amenity.name}
                    </option>
                  ))}
                </Box>
              </Box>

              {/* Booking Date */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  gridColumn: { xs: "1 / -1", sm: "span 2" },
                }}
              >
                <Typography component="label" sx={labelStyles}>
                  Booking Date *
                </Typography>
                <Box
                  component="input"
                  type="date"
                  name="bookingDate"
                  required
                  value={formData.bookingDate}
                  onChange={handleChange}
                  sx={inputStyles}
                />
              </Box>

              {/* Check-In Time */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <Typography component="label" sx={labelStyles}>
                  Check-in Time
                </Typography>
                <Box
                  component="input"
                  type="time"
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleChange}
                  sx={inputStyles}
                />
              </Box>

              {/* Check-Out Time */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <Typography component="label" sx={labelStyles}>
                  Check-out Time
                </Typography>
                <Box
                  component="input"
                  type="time"
                  name="checkOutTime"
                  value={formData.checkOutTime}
                  onChange={handleChange}
                  sx={inputStyles}
                />
              </Box>

              {/* Status (Optional for Admin use, defaults to confirmed) */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  gridColumn: "1 / -1",
                }}
              >
                <Typography component="label" sx={labelStyles}>
                  Booking Status
                </Typography>
                <Box
                  component="select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  sx={{ ...inputStyles, cursor: "pointer", appearance: "auto" }}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                mt: "24px",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="button"
                sx={{
                  backgroundColor: "transparent",
                  border: `1.5px solid ${tokens.slate300}`,
                  color: tokens.slate700,
                  borderRadius: "9999px",
                  padding: "10px 22px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "none",
                  fontFamily: '"DM Sans", sans-serif',
                  "&:hover": { backgroundColor: tokens.slate100 },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                sx={{
                  backgroundColor: tokens.navy800,
                  color: tokens.white,
                  borderRadius: "9999px",
                  padding: "10px 22px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "none",
                  fontFamily: '"DM Sans", sans-serif',
                  boxShadow: "0 4px 14px rgba(22,43,91,0.35)",
                  "&:hover": {
                    backgroundColor: tokens.navy700,
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {isEditMode ? "Update Booking" : "Confirm Booking"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
