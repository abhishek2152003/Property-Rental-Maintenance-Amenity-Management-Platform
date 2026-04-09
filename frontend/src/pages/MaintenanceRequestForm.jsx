import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import DashboardLayout from "../component/SideBar";
import { createMaintenanceRequest, getMaintenanceRequestById, updateMaintenanceRequest } from "../api/maintenanceRequest";
import { jwtDecode } from "jwt-decode";
import { fetchUserProfile } from "../api/user";

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

export default function CreateMaintenanceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    propertyId: "",
    userId: "",
    issueDescription: "",
    category: "Plumbing",
    priority: "Low",
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          
          if (id) {
            setIsEditMode(true);
            const requestData = await getMaintenanceRequestById(id);
            if (requestData) {
              setFormData({
                propertyId: requestData.propertyId || "",
                userId: decoded.id,
                issueDescription: requestData.issueDescription || "",
                category: requestData.category || "Plumbing",
                priority: requestData.priority || "Low",
              });
            }
          } else {
            const userProfile = await fetchUserProfile(decoded.id);
            setFormData((prev) => ({
              ...prev,
              userId: decoded.id,
              propertyId: userProfile.propertyId || "",
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
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
        await updateMaintenanceRequest(id, formData);
        alert("Maintenance request updated successfully!");
        navigate("/tenant/maintenance");
      } else {
        await createMaintenanceRequest(formData);
        alert("Maintenance request submitted!");
        setFormData({ ...formData, issueDescription: "" }); // Reset form
      }
    } catch (err) {
      alert(
        "Error: " + (err.response?.data?.error || err.message),
      );
    }
  };

  return (
    <DashboardLayout pageTitle="Maintenance">
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
            {isEditMode ? "Update Support Ticket" : "Submit Maintenance Request"}
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
              {/* Property Assignment Dropdown Removed - Automatically handled via User Profile context */}

              {/* Issue Category (Optional UI addition based on your initial HTML) */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <Typography component="label" sx={labelStyles}>
                  Issue Category
                </Typography>
                <Box
                  component="select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  sx={{ ...inputStyles, cursor: "pointer", appearance: "auto" }}
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="HVAC">HVAC / Heating</option>
                  <option value="Appliance">Appliance</option>
                  <option value="Other">Other</option>
                </Box>
              </Box>

              {/* Priority (Optional UI addition based on your initial HTML) */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <Typography component="label" sx={labelStyles}>
                  Priority Level
                </Typography>
                <Box
                  component="select"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  sx={{ ...inputStyles, cursor: "pointer", appearance: "auto" }}
                >
                  <option value="Low">Low - Not Urgent</option>
                  <option value="Medium">Medium - Standard</option>
                  <option value="High">High — Urgent (Leaks, Outages)</option>
                </Box>
              </Box>

              {/* Description (Maps to issueDescription) */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  gridColumn: "1 / -1",
                }}
              >
                <Typography component="label" sx={labelStyles}>
                  Issue Description *
                </Typography>
                <Box
                  component="textarea"
                  name="issueDescription"
                  required
                  rows="5"
                  value={formData.issueDescription}
                  onChange={handleChange}
                  placeholder="Please describe the issue in detail. Where is it located? When did it start?"
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
                Submit {isEditMode ? "Update" : "Request"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
