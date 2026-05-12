import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import DashboardLayout from "../component/SideBar";
import { createAmenity, fetchProperties, getAmenityById, updateAmenity } from "../api/amenity";
import { useParams, useNavigate } from "react-router-dom";
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

// Reusable styling for form inputs to match your exact CSS
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
};

const labelStyles = {
  fontSize: "12px",
  fontWeight: 600,
  color: tokens.slate700,
  letterSpacing: "0.03em",
  fontFamily: '"DM Sans", sans-serif',
};

import { toast } from "react-toastify";

export default function CreateAmenityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    name: "",
    propertyId: "",
    description: "",
    image: null,
  });

  const [properties, setProperties] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (err) {
        console.error("Failed to load properties for dropdown");
        toast.error("Failed to load properties list");
      }
    };
    loadProperties();
  }, []);

  useEffect(() => {
    const fetchAmenityDetails = async () => {
      if (isEditMode) {
        try {
          const res = await getAmenityById(id);
          const amenityData = res.data || res;
          setFormData({
            name: amenityData.name || "",
            propertyId: amenityData.propertyId || "",
            description: amenityData.description || "",
            image: null,
          });
          if (amenityData.image) {
            setImagePreview(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001'}/${amenityData.image}`);
          }
        } catch (error) {
          console.error("Failed to fetch amenity details", error);
          toast.error("Failed to fetch amenity details");
        }
      }
    };
    fetchAmenityDetails();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateAmenity(id, formData);
        toast.success("Amenity updated successfully!");
      } else {
        await createAmenity(formData);
        toast.success("Amenity created successfully!");
      }
      navigate("/owner/amenities");
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.error || "Server error"));
    }
  };


  return (
    <DashboardLayout pageTitle="Amenity">
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: tokens.slate50,
        }}
      >
        {/* 2. Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: { xs: "20px", md: "40px" },
            display: "flex",
            marginTop: "50px",
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
              {isEditMode ? "Update Amenity" : "Add New Amenity"}
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
                {/* Amenity Name (Required) */}
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <Typography component="label" sx={labelStyles}>
                    Amenity Name *
                  </Typography>
                  <Box
                    component="input"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rooftop Pool, Main Gym"
                    sx={inputStyles}
                  />
                </Box>

                {/* Property Assignment Dropdown (Required) */}
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <Typography component="label" sx={labelStyles}>
                    Assign to Property *
                  </Typography>
                  <Box
                    component="select"
                    name="propertyId"
                    required
                    value={formData.propertyId}
                    onChange={handleChange}
                    sx={{
                      ...inputStyles,
                      cursor: "pointer",
                      appearance: "auto",
                    }}
                  >
                    <option value="" disabled>
                      Select a property...
                    </option>
                    {properties.map((property) => (
                      <option key={property._id} value={property._id}>
                        {property.name}
                      </option>
                    ))}
                  </Box>
                </Box>

                {/* Image Upload Area */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    gridColumn: "1 / -1",
                  }}
                >
                  <Typography component="label" sx={labelStyles}>
                    Amenity Image
                  </Typography>
                  <Box
                    component="label"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "32px 24px",
                      border: `1.5px dashed ${tokens.slate300}`,
                      borderRadius: "12px",
                      backgroundColor: tokens.slate50,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                      "&:hover": {
                        borderColor: tokens.blue500,
                        backgroundColor: tokens.blue50,
                      },
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />

                    {imagePreview ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          component="img"
                          src={imagePreview}
                          alt="Preview"
                          sx={{
                            maxHeight: "180px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: tokens.blue500,
                            fontWeight: 600,
                            fontFamily: '"DM Sans"',
                          }}
                        >
                          Click to change image
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <Typography sx={{ fontSize: "28px", mb: 1 }}>
                          🏊
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: tokens.slate700,
                            fontWeight: 600,
                            fontFamily: '"DM Sans", sans-serif',
                          }}
                        >
                          Click to upload an amenity photo
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: tokens.slate500,
                            fontFamily: '"DM Sans", sans-serif',
                            mt: 0.5,
                          }}
                        >
                          SVG, PNG, JPG or GIF (max. 5MB)
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>

                {/* Description */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    gridColumn: "1 / -1",
                  }}
                >
                  <Typography component="label" sx={labelStyles}>
                    Description & Rules
                  </Typography>
                  <Box
                    component="textarea"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details, operating hours, or usage rules..."
                    sx={{ ...inputStyles, resize: "vertical" }}
                  />
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
                  onClick={() => navigate("/owner/amenities")}
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
                  {isEditMode ? "Update Amenity" : "Create Amenity"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
