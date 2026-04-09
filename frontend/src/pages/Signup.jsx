import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  MenuItem,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import "@fontsource/dm-sans";
import "@fontsource/libre-baskerville";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "tenant",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    // validation should be here
    if (!formData.username || !formData.email || !formData.password) {
      alert("All fields are required");
      return;
    }
    try {
      const res = await registerUser(formData);
      alert(res.data.message);

      navigate("/login"); // redirect
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#F8FAFC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 420,
          p: 4,
          borderRadius: "24px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 16px rgba(15,32,68,0.10)",
          animation: "fadeUp 0.5s ease",
        }}
      >
        {/* Logo */}
        <Typography
          sx={{
            fontFamily: "Libre Baskerville",
            fontWeight: 700,
            fontSize: "20px",
            textAlign: "center",
            color: "#0F2044",
            mb: 3,
          }}
        >
          Prop<span style={{ color: "#60A5FA" }}>Flow</span>
        </Typography>

        {/* Heading */}
        <Typography
          sx={{
            fontFamily: "Libre Baskerville",
            fontWeight: 700,
            fontSize: "24px",
            color: "#0F2044",
            mb: 1,
          }}
        >
          Create Account
        </Typography>

        <Typography
          sx={{
            fontFamily: "DM Sans",
            fontSize: "14px",
            color: "#64748B",
            mb: 3,
          }}
        >
          Get started with your property management
        </Typography>

        {/* Name */}
        <Typography sx={labelStyle}>Full Name</Typography>
        <TextField
          name="username"
          value={formData.username}
          fullWidth
          placeholder="Enter your name"
          size="small"
          onChange={handleChange}
          sx={inputStyle}
        />

        {/* Email */}
        <Typography sx={labelStyle}>Email</Typography>
        <TextField
          name="email"
          type="email"
          value={formData.email}
          fullWidth
          placeholder="Enter your email"
          size="small"
          onChange={handleChange}
          sx={inputStyle}
        />

        {/* Password */}
        <Typography sx={labelStyle}>Password</Typography>
        <TextField
          name="password"
          value={formData.password}
          fullWidth
          type="password"
          placeholder="Create password"
          size="small"
          onChange={handleChange}
          sx={inputStyle}
        />

        {/* Role */}
        <Typography sx={labelStyle}>Role</Typography>
        <TextField
          select
          name="role"
          value={formData.role}
          onChange={handleChange}
          fullWidth
          size="small"
          sx={inputStyle}
        >
          <MenuItem value="tenant">Tenant</MenuItem>
          <MenuItem value="owner">Owner</MenuItem>
        </TextField>

        {/* Button */}
        <Button
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#162B5B",
            color: "#FFFFFF",
            borderRadius: "9999px",
            py: "10px",
            fontFamily: "DM Sans",
            fontSize: "14px",
            textTransform: "none",
            boxShadow: "0 4px 14px rgba(22,43,91,0.35)",
            "&:hover": {
              backgroundColor: "#1E3A72",
              transform: "translateY(-1px)",
            },
          }}
          onClick={handleSubmit}
        >
          Create Account
        </Button>

        {/* Footer */}
        <Typography
          sx={{
            mt: 2,
            textAlign: "center",
            fontSize: "13px",
            fontFamily: "DM Sans",
            color: "#64748B",
          }}
        >
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="none"
            sx={{ color: "#1D4ED8", fontWeight: 500 }}
          >
            Login
          </Link>
        </Typography>
      </Paper>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
}

/* 🔹 Reusable styles */

const labelStyle = {
  fontFamily: "DM Sans",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#64748B",
  mb: 1,
  mt: 2,
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    fontFamily: "DM Sans",
    "& fieldset": {
      border: "1.5px solid #CBD5E1",
    },
    "&:hover fieldset": {
      borderColor: "#3B82F6",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3B82F6",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
    },
  },
};
