import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import { Box, TextField, Typography, Button, Paper, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";

import "@fontsource/dm-sans";
import "@fontsource/libre-baskerville";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await loginUser(formData);
      toast.success(res.data.message);
      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token);
      if (decoded.role?.toLowerCase() === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/tenant/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
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
            width: 380,
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
            Welcome Back
          </Typography>

          <Typography
            sx={{
              fontFamily: "DM Sans",
              fontSize: "14px",
              color: "#64748B",
              mb: 3,
            }}
          >
            Login to manage your properties
          </Typography>

          {/* Email */}
          <Typography
            sx={{
              fontFamily: "DM Sans",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#64748B",
              mb: 1,
            }}
          >
            Email
          </Typography>

          <TextField
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            placeholder="Enter your email"
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
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
            }}
          />

          {/* Password */}
          <Typography
            sx={{
              fontFamily: "DM Sans",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#64748B",
              mb: 1,
            }}
          >
            Password
          </Typography>

          <TextField
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            type="password"
            placeholder="Enter your password"
            variant="outlined"
            size="small"
            sx={{
              mb: 3,
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
            }}
          />

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            sx={{
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
          >
            Login
          </Button>

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="none"
              sx={{
                fontSize: "13px",
                color: "#1D4ED8",
                fontFamily: "DM Sans",
              }}
            >
              Forgot password?
            </Link>

            <Link
              component={RouterLink}
              to="/signup"
              underline="none"
              sx={{
                fontSize: "13px",
                color: "#1D4ED8",
                fontFamily: "DM Sans",
              }}
            >
              Signup
            </Link>
          </Box>
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
    </form>
  );
}
