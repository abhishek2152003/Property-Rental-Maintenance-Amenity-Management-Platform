import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import DashboardLayout from "../component/SideBar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { fetchOwnerProperties, addTenantToProperty } from "../api/property";

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

const inputStyles = {
  padding: "10px 14px",
  borderRadius: "12px",
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

export default function AddTenant() {
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    propertyId: "",
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      loadProperties(decoded.id);
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/login");
    }
  }, [navigate]);

  const loadProperties = async (ownerId) => {
    try {
      const res = await fetchOwnerProperties(ownerId);
      setProperties(res.data || []);
      if (res.data && res.data.length > 0) {
        setFormData((prev) => ({ ...prev, propertyId: res.data[0]._id }));
      }
    } catch (err) {
      console.error("Failed to fetch properties", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.propertyId || !formData.email) {
      alert("Please select a property and enter an email.");
      return;
    }

    try {
      await addTenantToProperty(formData.propertyId, formData.email);
      alert("Tenant added successfully!");
      setFormData({ ...formData, email: "" }); // Reset email field
    } catch (error) {
      console.error("Error adding tenant:", error);
      alert("Failed to add tenant: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <DashboardLayout pageTitle="Add Tenant">
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
        <Box sx={{ width: "100%", maxWidth: "600px" }}>
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
            Add Tenant to Property
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: tokens.white,
              borderRadius: "24px",
              padding: { xs: "20px", md: "28px" },
              boxShadow: "0 4px 16px rgba(15,32,68,0.10)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Property Selector */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Typography component="label" sx={labelStyles}>
                Select Property *
              </Typography>
              <Box
                component="select"
                name="propertyId"
                required
                value={formData.propertyId}
                onChange={handleChange}
                sx={{ ...inputStyles, cursor: "pointer", appearance: "auto" }}
              >
                {properties.map((prop) => (
                  <option key={prop._id} value={prop._id}>
                    {prop.name} - {prop.address}
                  </option>
                ))}
                {properties.length === 0 && (
                  <option value="" disabled>No properties available</option>
                )}
              </Box>
            </Box>

            {/* Tenant Email */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Typography component="label" sx={labelStyles}>
                Tenant Email *
              </Typography>
              <Box
                component="input"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="tenant@example.com"
                sx={inputStyles}
              />
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
                onClick={() => navigate("/dashboard")}
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
                Add Tenant
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
